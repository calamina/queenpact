import type { Pact } from '@/domain/pact'
import type { BattleModel } from '@/domain/battle'
import type { PendingReforge, ReforgeResult } from './item'

export const DayPhase = {
  CREATING: 'creating',
  READY: 'ready',
  FIGHTING: 'fighting',
  RESULT: 'result',
  REFORGE: 'reforge',
  END: 'end',
} as const
export type DayPhase = (typeof DayPhase)[keyof typeof DayPhase]

export interface Day {
  id: number
  pacts: Pact[]
  phase: DayPhase
  tier: number | null
  battle: BattleModel | null
  reforge: PendingReforge | null
  reforgeResult: ReforgeResult | null
}

export function createDay(id: number, tier: number | null, activeFighters: Pact[] = []): Day {
  return {
    id,
    pacts: [...activeFighters],
    phase: activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING,
    tier,
    battle: null,
    reforge: null,
    reforgeResult: null,
  }
}
