import { defineStore } from 'pinia'
import { computed, ref, markRaw, shallowRef } from 'vue'
import { useBattleQueue } from '@/entities/BattleQueue'
import type { Pact } from '@/entities/Pact'
import { useDay, type Day } from '@/entities/Day'

export const useStore = defineStore('store', () => {
  const completedDays = shallowRef<Day[]>([])
  const activeDay = ref<Day | null>(null)
  const queue = ref(useBattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)

  const days = computed(() =>
    activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value,
  )

  const toggleAutofight = () => (autofight.value = !autofight.value)
  const toggleBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    const targetTier = queue.value.getAvailableTier()
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const pair = queue.value.get(targetTier)
      if (pair) activeFighters = pair
    }

    const dayId = completedDays.value.length + 1
    activeDay.value = useDay(dayId, targetTier, activeFighters)
  }

  const finalizeDay = async () => {
    if (!activeDay.value || !activeDay.value.battle) return
    activeDay.value.finish()
    queue.value.update(activeDay.value.battle)
    completedDays.value.push(markRaw(activeDay.value))
    activeDay.value = null
  }

  // const reset = () => {
  //   completedDays.value = []
  //   activeDay.value = null
  //   queue.value = useBattleQueue()
  //   autofight.value = false
  //   blitz.value = false
  //   startNewDay()
  // }

  return {
    days,
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
