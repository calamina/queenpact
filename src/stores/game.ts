import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowRef } from 'vue'
import {
  createBattleQueue,
  getAvailableQueueTier,
  getQueueEntry,
  updateQueueWithBattle,
} from '@/domain/battle-queue'
import type { Pact } from '@/domain/pact'
import { createDay, finishDay, snapshotDay, type ActiveDay, type DaySnapshot } from '@/domain/day'
import { HISTORY } from '@/utils/constants'

export const useGameStore = defineStore('game', () => {
  const completedDays = shallowRef<DaySnapshot[]>([])
  const activeDay = shallowRef<ActiveDay | null>(null)
  const queue = reactive(createBattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)

  const days = computed(() =>
    activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value,
  )

  const visibleDays = computed(() => {
    const visibleHistory = completedDays.value.slice(-Math.max(HISTORY.MAX_VISIBLE_DAYS - 1, 0))
    return activeDay.value ? [...visibleHistory, activeDay.value] : visibleHistory
  })

  const toggleAutofight = () => (autofight.value = !autofight.value)
  const toggleBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    if (activeDay.value) return

    const targetTier = getAvailableQueueTier(queue)
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const pair = getQueueEntry(queue, targetTier)
      if (pair) activeFighters = pair
    }

    const dayId = completedDays.value.length + 1
    activeDay.value = reactive(createDay(dayId, targetTier, activeFighters))
  }

  const finalizeDay = (expectedDay: ActiveDay) => {
    const day = activeDay.value
    if (day !== expectedDay || !day.battle) return

    finishDay(day)
    const snapshot = snapshotDay(day)
    if (!snapshot) return

    updateQueueWithBattle(queue, day.battle)
    completedDays.value = [...completedDays.value, snapshot]
    activeDay.value = null
  }

  return {
    days,
    visibleDays,
    activeDay,
    winnerQueue: queue,
    startNewDay,
    finalizeDay,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
  }
})
