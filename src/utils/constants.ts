import type { BattleOutcome } from '@/domain/battle'
import type { StatType } from '@/domain/stat'

export const FIGHT = {
  MAX_IDLE_ROUNDS: 3,
  MITIGATION_K: 120,
} as const

export const LEVELUP = {
  HP_VALUE: 5,
  DEFAULT_VALUE: 1,
} as const

export const DICES: Record<StatType, { dices: number; d: number }> = {
  HP: { dices: 4, d: 9 },
  ATK: { dices: 2, d: 6 },
  DEF: { dices: 2, d: 4 },
} as const

export const MAX_JOURNAL_ENTRIES = 4

export const TIERS = {
  1: 'Pacten',
  2: 'Qhand',
  3: 'Jjaar',
  4: 'Shand',
  5: 'Strahl',
  6: 'Abstrahl',
  7: 'Myrie',
  8: 'Anda-Myrie',
} as const
export type TierKey = keyof typeof TIERS

export const MESSAGES_OUTCOME: Record<BattleOutcome | '_', string> = {
  victory: 'Victory !',
  stalemate: 'Their strength matches !',
  unfortunate: 'Everyone met an unfortunate end ...',
  _: '???',
} as const

export const MESSAGES_ACTION: Record<BattleOutcome | '_', string> = {
  victory: 'They went home to rest',
  stalemate: 'They fell in love !!',
  unfortunate: 'They were brave fighters',
  _: '???',
} as const

export const MESSAGE_BATTLE_AGAIN = 'Some champions want to battle each other !'
