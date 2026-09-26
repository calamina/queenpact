import { reactive, ref } from 'vue'
import type { Item } from '@/entities/Item'
import type { StatType } from '@/entities/Stat'
import { FIGHT, LEVELUP } from '@/utils/constants'
import type { Pact } from './Pact'

type BattleOutcome = 'victory' | 'stalemate' | 'unfortunate'
export type BattleRewards = {
  item: Item | null
  stat: { type: StatType; value: number } | null
}

export type Battle = ReturnType<typeof useBattle>

export function useBattle(p1: Pact, p2: Pact) {
  const round = ref(0)
  const outcome = ref<BattleOutcome>('stalemate')
  const winner = ref<Pact | null>(null)
  const loser = ref<Pact | null>(null)
  const rewards = ref<BattleRewards>({ item: null, stat: null })

  function getLivePacts(): boolean[] {
    return [p1.stats.HP.current > 0, p2.stats.HP.current > 0]
  }

  function setOutcome(): BattleOutcome {
    const [p1Alive, p2Alive] = getLivePacts()
    if (p1Alive && p2Alive) return (outcome.value = 'stalemate')
    if (!p1Alive && !p2Alive) return (outcome.value = 'unfortunate')
    return (outcome.value = 'victory')
  }

  function setWinnerandLoser() {
    const [p1Alive] = getLivePacts()
    winner.value = p1Alive ? p1 : p2
    loser.value = p1Alive ? p2 : p1
  }

  function setRewards(): BattleRewards {
    const stolenItem = loser.value?.stealRandomItem() ?? null
    const statTypes: StatType[] = ['ATK', 'DEF', 'HP']
    const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'

    rewards.value = {
      item: stolenItem,
      stat: {
        type: selectedType,
        value: selectedType === 'HP' ? LEVELUP.HP_VALUE : LEVELUP.DEFAULT_VALUE,
      },
    }
    return rewards.value
  }

  function isFinished(): boolean {
    const [p1Alive, p2Alive] = getLivePacts()
    if (!p1Alive || !p2Alive) return true

    if (
      round.value >= FIGHT.MAX_IDLE_ROUNDS &&
      p1.stats.HP.current === p1.stats.HP.total &&
      p2.stats.HP.current === p2.stats.HP.total
    ) {
      return true
    }
    return false
  }

  function executeRound(): void {
    if (isFinished()) return
    round.value++
    p1.applyDamage(p2)
    p2.applyDamage(p1)
  }

  function finish(): void {
    if (outcome.value !== 'stalemate' || winner.value !== null) return
    setOutcome()
    setWinnerandLoser()
    setRewards()
  }

  return reactive({
    p1,
    p2,
    round,
    outcome,
    winner,
    loser,
    rewards,
    isFinished,
    executeRound,
    finish,
  })
}
