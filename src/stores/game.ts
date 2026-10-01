import { defineStore } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import {
  createBattleQueue,
  getAvailableQueueTier,
  getQueueEntry,
  updateQueueWithBattle,
} from '@/domain/battle-queue'
import type { Pact } from '@/domain/pact'
import { createDay, DayPhase, finishDay, type Day } from '@/domain/day'
import { createJournal } from '@/domain/journal'
import { logBattle } from '@/domain/battle'

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
    if (day !== expectedDay || !day.battle || day.phase === DayPhase.END) return

    finishDay(day)
    updateQueueWithBattle(queue, day.battle)
    logBattle(journal.value, day.id, day.battle)
  }

  return {
    activeDay,
    winnerQueue: queue,
    startNewDay,
    finalizeDay,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
    journal,
  }
})
