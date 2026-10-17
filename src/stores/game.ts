import { defineStore } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import {
  createBattleQueue,
  getTierReadyForBattle,
  getHighestTierFighter,
  getFighterPairAtTier,
  advanceQueueAfterBattle,
  NextFighterItemUpdateType,
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
  type DayEvent,
  type Day,
} from '@/domain/day'
import { createJournal } from '@/domain/journal'
import {
  type Battle,
  createBattle,
  getBattleRewardAction,
  BattleRewardActionType,
  resolveBattleResult,
  addBattleToJournal,
} from '@/domain/battle'
import { rollReforge } from '@/domain/item'

const PACTLESS_DAY_FREQUENCY = 6

type DaySetup = {
  kind: DayKind
  tier: number | null
  fighters: [Pact | null, Pact | null]
}

function selectDaySetup(dayId: number, queue: ReturnType<typeof createBattleQueue>): DaySetup {
  if (dayId % PACTLESS_DAY_FREQUENCY === 0) {
    const queenpact = getHighestTierFighter(queue)
    return {
      kind: DayKind.PACTLESS,
      tier: null,
      fighters: [queenpact, createPactless(queenpact)],
    }
  }

  const tier = getTierReadyForBattle(queue)
  const fighters = tier === null ? null : getFighterPairAtTier(queue, tier)

  return fighters
    ? { kind: DayKind.TIER, tier, fighters }
    : { kind: DayKind.REGULAR, tier: null, fighters: [null, null] }
}

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
    const setup = selectDaySetup(id, queue)
    const day = reactive(createDay(id, setup.kind, setup.tier, setup.fighters))
    if (day.pacts[0] && day.pacts[1]) {
      transitionDay(day, { type: DayEventType.FIGHTERS_READY })
    } else if (day.kind === DayKind.PACTLESS && !day.pacts[0]) {
      transitionDay(day, { type: DayEventType.NO_OPPONENT })
    }
    activeDay.value = day
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

  const startBattleForDay = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || day.phase !== DayPhase.READY) return

    const [p1, p2] = day.pacts
    if (!p1 || !p2) return
    transitionDay(day, {
      type: DayEventType.BATTLE_STARTED,
      battle: createBattle(p1, p2),
    })
  }

  const finalizeBattleDay = (
    day: Day,
    event: Extract<
      DayEvent,
      { type: typeof DayEventType.COMPLETED | typeof DayEventType.REFORGE_COMPLETED }
    >,
    itemUpdate?: NextFighterItemUpdate,
  ): void => {
    if (!day.battle) return
    transitionDay(day, event)
    advanceQueueAfterBattle(queue, day.battle, itemUpdate)
    addBattleToJournal(journal.value, day.id, day.battle)
  }

  const continueDayAfterBattle = (day: Day, battle: Battle): void => {
    const rewardAction = getBattleRewardAction(battle)
    switch (rewardAction.type) {
      case BattleRewardActionType.COMPLETE:
        finalizeBattleDay(day, { type: DayEventType.COMPLETED })
        break
      case BattleRewardActionType.REFORGE:
        transitionDay(day, {
          type: DayEventType.REFORGE_REQUESTED,
          reforge: rewardAction.duplicate,
        })
        break
      case BattleRewardActionType.GRANT:
        finalizeBattleDay(
          day,
          { type: DayEventType.COMPLETED },
          {
            type: NextFighterItemUpdateType.REWARD,
            item: rewardAction.item,
          },
        )
        break
    }
  }

  const finishBattleForDay = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || !day.battle || day.phase !== DayPhase.FIGHTING) return

    const battle = day.battle
    resolveBattleResult(battle)
    transitionDay(day, { type: DayEventType.BATTLE_FINISHED })
    continueDayAfterBattle(day, battle)
  }

  const startReforgeForDay = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || day.phase !== DayPhase.DUPLICATE) return
    transitionDay(day, { type: DayEventType.REFORGE_STARTED })
  }

  const resolveReforgeForDay = (expectedDay: Day) => {
    const day = activeDay.value
    const winner = day?.battle?.winner
    const duplicate = day?.reforge
    if (day !== expectedDay || day.phase !== DayPhase.REFORGE || !winner || !duplicate) return

    const itemIndex = winner.items.findIndex((item) => item.type === duplicate.current.type)
    if (itemIndex === -1) return

    const result = rollReforge(duplicate.current, duplicate.reward)
    finalizeBattleDay(
      day,
      { type: DayEventType.REFORGE_COMPLETED, result },
      {
        type: NextFighterItemUpdateType.REFORGE,
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
    startBattleForDay,
    finishBattleForDay,
    startReforgeForDay,
    resolveReforgeForDay,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
    journal,
  }
})
