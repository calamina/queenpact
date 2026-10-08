import { ref } from 'vue'
import { type Day } from '@/domain/day'
import { executeBattleRound, isBattleFinished } from '@/domain/battle'
import { sleep } from '@/utils/utils'

type BattleOptions = {
  blitz: boolean
  onFinished: () => void
}

const BATTLE_STATE = {
  IDLE: 'IDLE',
  FIGHTING: 'FIGHTING',
  FINISHED: 'FINISHED',
} as const
type BattleState = (typeof BATTLE_STATE)[keyof typeof BATTLE_STATE]

export function useStartBattle(day: Day, { blitz, onFinished }: BattleOptions) {
  const battleState = ref<BattleState>(BATTLE_STATE.IDLE)

  const TIMER = ref({
    IDLE: blitz ? 0 : 300,
    FIGHTING: blitz ? 0 : 800,
  })

  const setTimers = (round: number) => {
    if (round % 3 !== 0) return
    TIMER.value.IDLE = Math.max(50, TIMER.value.IDLE - 50)
    TIMER.value.FIGHTING = Math.max(200, TIMER.value.FIGHTING - 100)
  }

  const runBlitzBattle = () => {
    let maxRounds = 0
    while (day.battle && !isBattleFinished(day.battle) && maxRounds < 25) {
      executeBattleRound(day.battle)
      maxRounds++
    }
  }

  const runAnimatedBattle = async () => {
    while (day.battle && !isBattleFinished(day.battle)) {
      battleState.value = BATTLE_STATE.IDLE
      await sleep(TIMER.value.IDLE)

      battleState.value = BATTLE_STATE.FIGHTING
      await sleep(TIMER.value.FIGHTING)

      executeBattleRound(day.battle)
      setTimers(day.battle.round)
    }
  }

  const runBattle = async () => {
    if (day.battle && isBattleFinished(day.battle)) return
    if (!day.battle) return

    if (blitz) runBlitzBattle()
    else await runAnimatedBattle()

    battleState.value = BATTLE_STATE.FINISHED
    await sleep(TIMER.value.IDLE)
    onFinished()
  }

  return { battleState, runBattle, TIMER }
}
