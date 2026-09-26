import { ref } from 'vue'
import { useStore } from '@/composables/useStore'
import type { Day } from '@/entities/Day'
import { sleep } from '@/utils/utils'

export function useStartBattle(day: Day) {
  const store = useStore()
  const battleState = ref<'IDLE' | 'FIGHTING' | 'FINISHED'>('IDLE')

  const TIMER = ref({
    IDLE: store.blitz ? 0 : 300,
    FIGHTING: store.blitz ? 0 : 800,
  })

  const setTimers = (round: number) => {
    if (round % 3 !== 0) return
    TIMER.value.IDLE = Math.max(50, TIMER.value.IDLE - 50)
    TIMER.value.FIGHTING = Math.max(200, TIMER.value.FIGHTING - 100)
  }

  const runBlitzBattle = () => {
    let maxRounds = 0
    while (day.battle && !day.battle.isFinished() && maxRounds < 25) {
      day.battle.executeRound()
      maxRounds++
    }
  }

  const runAnimatedBattle = async () => {
    while (day.battle && !day.battle.isFinished()) {
      battleState.value = 'IDLE'
      await sleep(TIMER.value.IDLE)

      battleState.value = 'FIGHTING'
      await sleep(TIMER.value.FIGHTING)

      day.battle.executeRound()
      setTimers(day.battle.round)
    }
  }

  const runBattle = async () => {
    if (day.battle?.isFinished()) return
    if (!day.battle) day.startBattle()
    if (!day.battle) return

    if (store.blitz) runBlitzBattle()
    else await runAnimatedBattle()

    battleState.value = 'FINISHED'
    await sleep(TIMER.value.IDLE)
    store.finalizeDay()
  }

  return { battleState, runBattle, TIMER }
}
