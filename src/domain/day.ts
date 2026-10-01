import { createPact, type Pact } from '@/domain/pact'
import { createBattle, finishBattle, type BattleModel } from '@/domain/battle'

export const DayPhase = {
  CREATING: 0,
  READY: 1,
  FIGHTING: 2,
  END: 3,
} as const
export type DayPhase = (typeof DayPhase)[keyof typeof DayPhase]

export interface Day {
  id: number
  pacts: Pact[]
  phase: DayPhase
  tier: number | null
  battle: BattleModel | null
}

export function createDay(id: number, tier: number | null, activeFighters: Pact[] = []): Day {
  return {
    id,
    pacts: [...activeFighters],
    phase: activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING,
    tier,
    battle: null,
  }
}

export function addPactToDay(day: Day, pact: Pact, pactId: number): void {
  day.pacts[pactId - 1] = createPact(pact)
  if (day.pacts[0] && day.pacts[1]) day.phase = DayPhase.READY
}

export function startDayBattle(day: Day): void {
  const [p1, p2] = day.pacts
  if (p1 && p2) day.battle = createBattle(p1, p2)
  day.phase = DayPhase.FIGHTING
}

export function finishDay(day: Day): void {
  if (!day.battle) return
  finishBattle(day.battle)
  day.phase = DayPhase.END
}
