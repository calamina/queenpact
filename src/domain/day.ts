import type { Pact } from '@/domain/pact'
import type { BattleModel } from '@/domain/battle'
import type { PendingReforge, ReforgeResult } from './item'

export const DayPhase = {
  CREATING: 'creating',
  READY: 'ready',
  FIGHTING: 'fighting',
  RESULT: 'result',
  DUPLICATE: 'duplicate',
  REFORGE: 'reforge',
  END: 'end',
  NO_OPPONENT: 'no-opponent',
} as const
export type DayPhase = (typeof DayPhase)[keyof typeof DayPhase]

export const DayKind = {
  REGULAR: 'regular',
  TIER: 'tier',
  PACTLESS: 'pactless',
} as const

export type DayKind = (typeof DayKind)[keyof typeof DayKind]

export interface Day {
  id: number
  kind: DayKind
  tier: number | null
  pacts: [Pact | null, Pact | null]
  phase: DayPhase
  battle: BattleModel | null
  reforge: PendingReforge | null
  reforgeResult: ReforgeResult | null
}

const ALLOWED_TRANSITIONS: Record<DayPhase, readonly DayPhase[]> = {
  [DayPhase.CREATING]: [DayPhase.READY],
  [DayPhase.READY]: [DayPhase.FIGHTING],
  [DayPhase.FIGHTING]: [DayPhase.RESULT],
  [DayPhase.RESULT]: [DayPhase.DUPLICATE, DayPhase.END],
  [DayPhase.DUPLICATE]: [DayPhase.REFORGE],
  [DayPhase.REFORGE]: [DayPhase.END],
  [DayPhase.END]: [],
  [DayPhase.NO_OPPONENT]: [],
}

export function transitionDay(day: Day, nextPhase: DayPhase): void {
  if (!ALLOWED_TRANSITIONS[day.phase].includes(nextPhase)) {
    throw new Error(`Invalid day transition: ${day.phase} -> ${nextPhase}`)
  }

  day.phase = nextPhase
}

export function isDayComplete(day: Day): boolean {
  return day.phase === DayPhase.END || day.phase === DayPhase.NO_OPPONENT
}

export function createDay(
  id: number,
  kind: DayKind,
  tier: number | null,
  activeFighters: [Pact | null, Pact | null] = [null, null],
): Day {
  const phase =
    kind === DayKind.PACTLESS && !activeFighters[0]
      ? DayPhase.NO_OPPONENT
      : activeFighters.every(Boolean)
        ? DayPhase.READY
        : DayPhase.CREATING

  return {
    id,
    kind,
    tier,
    pacts: [...activeFighters],
    phase,
    battle: null,
    reforge: null,
    reforgeResult: null,
  }
}
