import { defineStore } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import {
  createBattleQueue,
  getAvailableQueueTier,
  getBestFighter,
  getQueueEntry,
  updateQueueWithBattle,
  type NextFighterItemUpdate,
} from '@/domain/battle-queue'
import { createPact, createPactless, type Pact } from '@/domain/pact'
import {
  createDay,
  DayKind,
  DayEventType,
  DayPhase,
  isDayComplete,
  transitionDay,
  validateDayEvent,
  type DayEvent,
  type Day,
} from '@/domain/day'
import { createJournal } from '@/domain/journal'
import { createBattle, finishBattle, logBattle } from '@/domain/battle'
import { checkDuplicateItemTypes, rollReforge } from '@/domain/item'

const PACTLESS_DAY_FREQUENCY = 6

export const useGameStore = defineStore('game', () => {
  const activeDay = shallowRef<Day | null>(null)
  const queue = reactive(createBattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)
  const journal = ref(createJournal())
  const dayId = ref(1)

  const toggleAutofight = () => (autofight.value = !autofight.value)
  const toggleBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    if (activeDay.value && !isDayComplete(activeDay.value)) return
    const id = dayId.value++
    const pactlessDay = id % PACTLESS_DAY_FREQUENCY === 0
    const targetTier = getAvailableQueueTier(queue)
    let kind: Day['kind'] = DayKind.REGULAR
    let activeFighters: [Pact | null, Pact | null] = [null, null]

    if (pactlessDay) {
      const queenpact = getBestFighter(queue)
      const pactless = createPactless(queenpact)
      kind = DayKind.PACTLESS
      activeFighters = [queenpact, pactless]
    } else if (targetTier !== null) {
      const pair = getQueueEntry(queue, targetTier)
      if (pair) {
        kind = DayKind.TIER
        activeFighters = pair
      }
    }

    const tier = kind === DayKind.TIER ? targetTier : null
    activeDay.value = reactive(createDay(id, kind, tier, activeFighters))
  }

  const addPactToDay = (expectedDay: Day, pact: Pact, pactId: number) => {
    const day = activeDay.value
    if (
      day !== expectedDay ||
      day.kind !== DayKind.REGULAR ||
      day.phase !== DayPhase.CREATING ||
      (pactId !== 1 && pactId !== 2)
    )
      return

    day.pacts[pactId - 1] = createPact(pact)
    if (day.pacts[0] && day.pacts[1]) {
      transitionDay(day, { type: DayEventType.FIGHTERS_READY })
    }
  }

  const startDayBattle = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || day.phase !== DayPhase.READY) return

    const [p1, p2] = day.pacts
    if (!p1 || !p2) return
    transitionDay(day, {
      type: DayEventType.BATTLE_STARTED,
      battle: createBattle(p1, p2),
    })
  }

  const completeBattleDay = (
    day: Day,
    event: Extract<
      DayEvent,
      { type: typeof DayEventType.COMPLETED | typeof DayEventType.REFORGE_COMPLETED }
    >,
    itemUpdate?: NextFighterItemUpdate,
  ): void => {
    if (!day.battle) return
    validateDayEvent(day, event)
    updateQueueWithBattle(queue, day.battle, itemUpdate)
    logBattle(journal.value, day.id, day.battle)
    transitionDay(day, event)
  }

  const finishDayBattle = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || !day.battle || day.phase !== DayPhase.FIGHTING) return

    const battle = day.battle
    finishBattle(battle)
    transitionDay(day, { type: DayEventType.BATTLE_FINISHED })

    const { winner, rewards } = battle
    if (!winner || !rewards.item) {
      completeBattleDay(day, { type: DayEventType.COMPLETED })
      return
    }

    const duplicate = checkDuplicateItemTypes(winner.items, rewards.item)
    if (duplicate) {
      transitionDay(day, { type: DayEventType.REFORGE_REQUESTED, reforge: duplicate })
      return
    }

    completeBattleDay(day, { type: DayEventType.COMPLETED }, { type: 'reward', item: rewards.item })
  }

  const startDayReforge = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || day.phase !== DayPhase.DUPLICATE) return
    transitionDay(day, { type: DayEventType.REFORGE_STARTED })
  }

  const resolveReforge = (expectedDay: Day) => {
    const day = activeDay.value
    const winner = day?.battle?.winner
    const duplicate = day?.reforge
    if (day !== expectedDay || day.phase !== DayPhase.REFORGE || !winner || !duplicate) return

    const itemIndex = winner.items.findIndex((item) => item.type === duplicate.current.type)
    if (itemIndex === -1) return

    const result = rollReforge(duplicate.current, duplicate.reward)
    completeBattleDay(
      day,
      { type: DayEventType.REFORGE_COMPLETED, result },
      {
        type: 'reforge',
        item: result.item,
      },
    )
  }

  return {
    activeDay,
    dayId,
    winnerQueue: queue,
    startNewDay,
    addPactToDay,
    startDayBattle,
    finishDayBattle,
    startDayReforge,
    resolveReforge,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
    journal,
  }
})
