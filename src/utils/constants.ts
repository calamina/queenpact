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

export const HISTORY = {
  MAX_VISIBLE_DAYS: 80,
} as const

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
