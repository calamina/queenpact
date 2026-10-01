import type { Item } from '@/domain/item'
import { STAT_TYPE, type StatType } from '@/domain/stat'
import { FIGHT, LEVELUP } from '@/utils/constants'
import { applyDamageToPact, getShortName, stealRandomItemFromPact, type Pact } from '@/domain/pact'
import { addJournalEntry, type JournalEntry } from './journal'

const BATTLE_OUTCOME = {
  VICTORY: 'victory',
  STALEMATE: 'stalemate',
  UNFORTUNATE: 'unfortunate',
} as const
export type BattleOutcome = (typeof BATTLE_OUTCOME)[keyof typeof BATTLE_OUTCOME]

export type BattleRewards = {
  item: Item | null
  stat: { type: StatType; value: number } | null
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

export function createBattle(p1: Pact, p2: Pact): BattleModel {
  return {
    p1,
    p2,
    round: 0,
    outcome: BATTLE_OUTCOME.STALEMATE,
    winner: null,
    loser: null,
    rewards: { item: null, stat: null },
  }
}

function getLivePacts(p1: Pact, p2: Pact): [boolean, boolean] {
  return [p1.stats.HP.current > 0, p2.stats.HP.current > 0]
}

function resolveBattleOutcome(p1: Pact, p2: Pact): BattleOutcome {
  const [p1Alive, p2Alive] = getLivePacts(p1, p2)
  if (p1Alive && p2Alive) return BATTLE_OUTCOME.STALEMATE
  if (!p1Alive && !p2Alive) return BATTLE_OUTCOME.UNFORTUNATE
  return BATTLE_OUTCOME.VICTORY
}

function resolveBattleWinner(p1: Pact, p2: Pact): { winner: Pact; loser: Pact } {
  const [p1Alive] = getLivePacts(p1, p2)
  return {
    winner: p1Alive ? p1 : p2,
    loser: p1Alive ? p2 : p1,
  }
}

function createBattleRewards(loser: Pact | null): BattleRewards {
  const stolenItem = loser ? stealRandomItemFromPact(loser) : null
  const statTypes: StatType[] = Object.values(STAT_TYPE)
  const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? STAT_TYPE.HP

  return {
    item: stolenItem,
    stat: {
      type: selectedType,
      value: selectedType === STAT_TYPE.HP ? LEVELUP.HP_VALUE : LEVELUP.DEFAULT_VALUE,
    },
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
  if (battle.outcome !== BATTLE_OUTCOME.STALEMATE || battle.winner !== null) return

  battle.outcome = resolveBattleOutcome(battle.p1, battle.p2)
  if (battle.outcome === BATTLE_OUTCOME.VICTORY) {
    const { winner, loser } = resolveBattleWinner(battle.p1, battle.p2)
    battle.winner = winner
    battle.loser = loser
  }

  battle.rewards = createBattleRewards(battle.loser)
}

export function logBattle(journal: JournalEntry[], dayId: number, battle: Battle): void {
  let p1 = getShortName(battle.winner ?? battle.p1)
  let p2 = getShortName(battle.loser ?? battle.p2)
  const message = setBattleOutcomeMessage(battle.outcome, p1, p2)
  addJournalEntry(journal, { dayId, message })
}

function setBattleOutcomeMessage(outcome: BattleOutcome, p1: string, p2: string): string {
  if (outcome === BATTLE_OUTCOME.VICTORY) {
    return `${p1} defeated ${p2}`
  }

  if (outcome === BATTLE_OUTCOME.UNFORTUNATE) {
    return `Farewell ${p1} & ${p2}`
  }

  return `${p1} ♡ ${p2}`
}
