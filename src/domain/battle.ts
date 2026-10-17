import { checkDuplicateItemTypes, type DuplicateItemPair, type Item } from '@/domain/item'
import { STAT_TYPE, type StatType } from '@/domain/stat'
import { applyDamageToPact, getPactShortName, rollStolenItem, type Pact } from '@/domain/pact'
import { addJournalEntry, type JournalEntry } from './journal'

const MAX_IDLE_ROUNDS = 3
const LEVELUP = {
  HP_VALUE: 5,
  DEFAULT_VALUE: 1,
} as const

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

export const BattleRewardActionType = {
  COMPLETE: 'complete',
  GRANT: 'grant',
  REFORGE: 'reforge',
} as const

export type BattleRewardAction =
  | { type: typeof BattleRewardActionType.COMPLETE }
  | { type: typeof BattleRewardActionType.GRANT; item: Item }
  | { type: typeof BattleRewardActionType.REFORGE; duplicate: DuplicateItemPair }

export interface BattleModel {
  p1: Pact
  p2: Pact
  round: number
  resolved: boolean
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
    resolved: false,
    outcome: BATTLE_OUTCOME.STALEMATE,
    winner: null,
    loser: null,
    rewards: { item: null, stat: null },
  }
}

function getPactAliveStates(p1: Pact, p2: Pact): [boolean, boolean] {
  return [p1.stats.HP.current > 0, p2.stats.HP.current > 0]
}

function determineBattleOutcome(p1: Pact, p2: Pact): BattleOutcome {
  const [p1Alive, p2Alive] = getPactAliveStates(p1, p2)
  if (p1Alive && p2Alive) return BATTLE_OUTCOME.STALEMATE
  if (!p1Alive && !p2Alive) return BATTLE_OUTCOME.UNFORTUNATE
  return BATTLE_OUTCOME.VICTORY
}

function getBattleWinnerAndLoser(p1: Pact, p2: Pact): { winner: Pact; loser: Pact } {
  const [p1Alive] = getPactAliveStates(p1, p2)
  return {
    winner: p1Alive ? p1 : p2,
    loser: p1Alive ? p2 : p1,
  }
}

function rollBattleRewards(loser: Pact | null): BattleRewards {
  const stolenItem = loser ? rollStolenItem(loser) : null
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

export function isBattleComplete(battle: Battle): boolean {
  const { p1, p2 } = battle
  const [p1Alive, p2Alive] = getPactAliveStates(p1, p2)
  if (!p1Alive || !p2Alive) return true

  if (
    battle.round >= MAX_IDLE_ROUNDS &&
    p1.stats.HP.current === p1.stats.HP.total &&
    p2.stats.HP.current === p2.stats.HP.total
  ) {
    return true
  }
  return false
}

export function executeBattleRound(battle: Battle): void {
  if (isBattleComplete(battle)) return

  battle.round += 1
  applyDamageToPact(battle.p1, battle.p2)
  applyDamageToPact(battle.p2, battle.p1)
}

export function resolveBattleResult(battle: Battle): void {
  if (battle.resolved) return

  battle.outcome = determineBattleOutcome(battle.p1, battle.p2)
  if (battle.outcome === BATTLE_OUTCOME.VICTORY) {
    const { winner, loser } = getBattleWinnerAndLoser(battle.p1, battle.p2)
    battle.winner = winner
    battle.loser = loser
  }

  battle.rewards = battle.winner?.pactless
    ? { item: null, stat: null }
    : rollBattleRewards(battle.loser)
  battle.resolved = true
}

export function getBattleRewardAction(battle: Battle): BattleRewardAction {
  const { winner, rewards } = battle
  if (!winner || !rewards.item) return { type: BattleRewardActionType.COMPLETE }

  const duplicate = checkDuplicateItemTypes(winner.items, rewards.item)
  if (duplicate) return { type: BattleRewardActionType.REFORGE, duplicate }

  return { type: BattleRewardActionType.GRANT, item: rewards.item }
}

export function addBattleToJournal(journal: JournalEntry[], dayId: number, battle: Battle): void {
  const p1 = getPactShortName(battle.winner ?? battle.p1)
  const p2 = getPactShortName(battle.loser ?? battle.p2)
  const message = createBattleOutcomeMessage(battle.outcome, p1, p2)
  addJournalEntry(journal, { dayId, message })
}

function createBattleOutcomeMessage(outcome: BattleOutcome, p1: string, p2: string): string {
  if (outcome === BATTLE_OUTCOME.VICTORY) {
    return `${p1} defeated ${p2}`
  }

  if (outcome === BATTLE_OUTCOME.UNFORTUNATE) {
    return `Farewell ${p1} & ${p2}`
  }

  return `${p1} ♡ ${p2}`
}
