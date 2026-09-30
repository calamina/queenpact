import { createPact, snapshotPact, type Pact, type PactSnapshot } from '@/domain/pact'
import {
  createBattle,
  finishBattle,
  snapshotBattle,
  type BattleModel,
  type BattleSnapshot,
} from '@/domain/battle'

export const DayPhase = {
  CREATING: 0,
  READY: 1,
  FIGHTING: 2,
  RESULT: 3,
  END: 4,
} as const
export type DayPhase = (typeof DayPhase)[keyof typeof DayPhase]

export const DayType = {
  CLASSIC: 0,
  WINNERSHIP: 1,
} as const
export type DayType = (typeof DayType)[keyof typeof DayType]

export interface ActiveDay {
  id: number
  pacts: Pact[]
  phase: DayPhase
  type: DayType
  tier: number | null
  battle: BattleModel | null
  kind: 'live'
}

export type DaySnapshot = {
  readonly id: number
  readonly pacts: readonly PactSnapshot[]
  readonly phase: DayPhase
  readonly type: DayType
  readonly tier: number | null
  readonly battle: BattleSnapshot
  readonly kind: 'snapshot'
}

export function isLiveDay(day: ActiveDay | DaySnapshot): day is ActiveDay {
  return day.kind === 'live'
}

export function isSnapshotDay(day: ActiveDay | DaySnapshot): day is DaySnapshot {
  return day.kind === 'snapshot'
}

export function createDay(id: number, tier: number | null, activeFighters: Pact[] = []): ActiveDay {
  return {
    id,
    pacts: [...activeFighters],
    phase: activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING,
    type: activeFighters.length > 0 ? DayType.WINNERSHIP : DayType.CLASSIC,
    tier,
    battle: null as BattleModel | null,
    kind: 'live' as const,
  }
}

export function addPactToDay(day: ActiveDay, pact: Pact, pactId: number): void {
  day.pacts[pactId - 1] = createPact(pact)
  if (day.pacts.length === 2) {
    day.phase = DayPhase.READY
  }
}

export function startDayBattle(day: ActiveDay): void {
  const [p1, p2] = day.pacts
  if (p1 && p2) day.battle = createBattle(p1, p2)
  day.phase = DayPhase.FIGHTING
}

export function finishDay(day: ActiveDay): void {
  if (!day.battle) return
  finishBattle(day.battle)
  day.phase = DayPhase.RESULT
  day.phase = DayPhase.END
}

export function snapshotDay(day: ActiveDay): DaySnapshot | null {
  const battle = day.battle
  if (!battle) return null

  return {
    id: day.id,
    pacts: day.pacts.map(snapshotPact),
    phase: day.phase,
    type: day.type,
    tier: day.tier,
    battle: snapshotBattle(battle),
    kind: 'snapshot' as const,
  }
}
