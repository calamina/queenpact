import { defineStore } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import {
  createBattleQueue,
  getAvailableQueueTier,
  getQueueEntry,
  updateQueueWithBattle,
} from '@/domain/battle-queue'
import type { Pact } from '@/domain/pact'
import { createDay, DayPhase, finishDayBattle, type Day } from '@/domain/day'
import { createJournal } from '@/domain/journal'
import { logBattle } from '@/domain/battle'
import { checkDuplicateItemTypes, rollReforge, type Item } from '@/domain/item'

export const useGameStore = defineStore('game', () => {
  const activeDay = shallowRef<Day | null>(null)
  const queue = reactive(createBattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)
  const journal = ref(createJournal())
  let dayId = 1

  const toggleAutofight = () => (autofight.value = !autofight.value)
  const toggleBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    if (activeDay.value && activeDay.value.phase !== DayPhase.END) return

    const targetTier = getAvailableQueueTier(queue)
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const pair = getQueueEntry(queue, targetTier)
      if (pair) activeFighters = pair
    }

    activeDay.value = reactive(createDay(dayId++, targetTier, activeFighters))
  }

  const finalizeDay = (expectedDay: Day) => {
    const day = activeDay.value
    if (day !== expectedDay || !day.battle || day.phase !== DayPhase.FIGHTING) return

    finishDayBattle(day)
    const { winner, rewards } = day.battle
    if (!winner || !rewards.item) return completeDay(day)

    const duplicate = checkDuplicateItemTypes(winner.items, rewards.item)
    if (duplicate) {
      day.reforge = duplicate
      day.phase = DayPhase.REFORGE
      return
    }
    winner.items.push(rewards.item)
    completeDay(day)
  }

  const resolveReforge = () => {
    const day = activeDay.value
    const winner = day?.battle?.winner
    const duplicate = day?.reforge
    if (!day || day.phase !== DayPhase.REFORGE || !winner || !duplicate) return

    const itemIndex = winner.items.findIndex((item) => item.type === duplicate.current.type)
    if (itemIndex === -1) return

    const result = rollReforge(duplicate.current, duplicate.reward)
    day.reforgeResult = result
    completeDay(day, result.item)
  }

  const completeDay = (day: Day, reforgedItem?: Item): void => {
    if (!day.battle) return
    updateQueueWithBattle(queue, day.battle, reforgedItem)
    logBattle(journal.value, day.id, day.battle)
    day.phase = DayPhase.END
  }

  return {
    activeDay,
    winnerQueue: queue,
    startNewDay,
    finalizeDay,
    resolveReforge,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
    journal,
  }
})
