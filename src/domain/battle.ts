import { snapshotItem, type Item, type ItemSnapshot } from '@/domain/item'
import type { StatType } from '@/domain/stat'
import { FIGHT, LEVELUP } from '@/utils/constants'
import {
  applyDamageToPact,
  snapshotPact,
  stealRandomItemFromPact,
  type Pact,
  type PactSnapshot,
} from '@/domain/pact'

export type BattleOutcome = 'victory' | 'stalemate' | 'unfortunate'
export type BattleRewards = {
  item: Item | null
  stat: { type: StatType; value: number } | null
}

export type BattleRewardsSnapshot = {
  readonly item: ItemSnapshot | null
  readonly stat: Readonly<{ type: StatType; value: number }> | null
}

export type BattleSnapshot = {
  readonly p1: PactSnapshot
  readonly p2: PactSnapshot
  readonly round: number
  readonly outcome: BattleOutcome
  readonly winner: PactSnapshot | null
  readonly loser: PactSnapshot | null
  readonly rewards: BattleRewardsSnapshot
}

export interface BattleModel {
  p1: Pact
  p2: Pact
  round: number
  outcome: BattleOutcome
  winner: Pact | null
  loser: Pact | null
  rewards: BattleRewards
}

export type Battle = BattleModel

export function getLivePacts(p1: Pact, p2: Pact): [boolean, boolean] {
  return [p1.stats.HP.current > 0, p2.stats.HP.current > 0]
}

export function resolveBattleOutcome(p1: Pact, p2: Pact): BattleOutcome {
  const [p1Alive, p2Alive] = getLivePacts(p1, p2)
  if (p1Alive && p2Alive) return 'stalemate'
  if (!p1Alive && !p2Alive) return 'unfortunate'
  return 'victory'
}

export function resolveBattleWinner(p1: Pact, p2: Pact): { winner: Pact; loser: Pact } {
  const [p1Alive] = getLivePacts(p1, p2)
  return {
    winner: p1Alive ? p1 : p2,
    loser: p1Alive ? p2 : p1,
  }
}

export function createBattleRewards(loser: Pact | null): BattleRewards {
  const stolenItem = loser ? stealRandomItemFromPact(loser) : null
  const statTypes: StatType[] = ['ATK', 'DEF', 'HP']
  const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'

  return {
    item: stolenItem,
    stat: {
      type: selectedType,
      value: selectedType === 'HP' ? LEVELUP.HP_VALUE : LEVELUP.DEFAULT_VALUE,
    },
  }
}

export function createBattle(p1: Pact, p2: Pact): BattleModel {
  return {
    p1,
    p2,
    round: 0,
    outcome: 'stalemate' as BattleOutcome,
    winner: null,
    loser: null,
    rewards: { item: null, stat: null },
  }
}

export function isBattleFinished(battle: Battle): boolean {
  const { p1, p2 } = battle
  const [p1Alive, p2Alive] = getLivePacts(p1, p2)
  if (!p1Alive || !p2Alive) return true

  if (
    battle.round >= FIGHT.MAX_IDLE_ROUNDS &&
    p1.stats.HP.current === p1.stats.HP.total &&
    p2.stats.HP.current === p2.stats.HP.total
  ) {
    return true
  }
  return false
}

export function executeBattleRound(battle: Battle): void {
  if (isBattleFinished(battle)) return

  battle.round += 1
  applyDamageToPact(battle.p1, battle.p2)
  applyDamageToPact(battle.p2, battle.p1)
}

export function finishBattle(battle: Battle): void {
  if (battle.outcome !== 'stalemate' || battle.winner !== null) return

  battle.outcome = resolveBattleOutcome(battle.p1, battle.p2)
  if (battle.outcome === 'victory') {
    const { winner, loser } = resolveBattleWinner(battle.p1, battle.p2)
    battle.winner = winner
    battle.loser = loser
  }

  battle.rewards = createBattleRewards(battle.loser)
}

function snapshotRewards(rewards: BattleRewards): BattleRewardsSnapshot {
  return {
    item: rewards.item ? snapshotItem(rewards.item) : null,
    stat: rewards.stat ? { ...rewards.stat } : null,
  }
}

export function snapshotBattle(battle: Battle): BattleSnapshot {
  return {
    p1: snapshotPact(battle.p1),
    p2: snapshotPact(battle.p2),
    round: battle.round,
    outcome: battle.outcome,
    winner: battle.winner ? snapshotPact(battle.winner) : null,
    loser: battle.loser ? snapshotPact(battle.loser) : null,
    rewards: snapshotRewards(battle.rewards),
  }
}
