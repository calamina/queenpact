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

export const DayEventType = {
  NO_OPPONENT: 'NO_OPPONENT',
  FIGHTERS_READY: 'FIGHTERS_READY',
  BATTLE_STARTED: 'BATTLE_STARTED',
  BATTLE_FINISHED: 'BATTLE_FINISHED',
  REFORGE_REQUESTED: 'REFORGE_REQUESTED',
  REFORGE_STARTED: 'REFORGE_STARTED',
  COMPLETED: 'COMPLETED',
  REFORGE_COMPLETED: 'REFORGE_COMPLETED',
} as const

export type DayEvent =
  | { type: typeof DayEventType.NO_OPPONENT }
  | { type: typeof DayEventType.FIGHTERS_READY }
  | { type: typeof DayEventType.BATTLE_STARTED; battle: BattleModel }
  | { type: typeof DayEventType.BATTLE_FINISHED }
  | { type: typeof DayEventType.REFORGE_REQUESTED; reforge: PendingReforge }
  | { type: typeof DayEventType.REFORGE_STARTED }
  | { type: typeof DayEventType.COMPLETED }
  | { type: typeof DayEventType.REFORGE_COMPLETED; result: ReforgeResult }

const EVENT_TRANSITIONS: Record<DayEvent['type'], { from: DayPhase; to: DayPhase }> = {
  [DayEventType.NO_OPPONENT]: { from: DayPhase.CREATING, to: DayPhase.NO_OPPONENT },
  [DayEventType.FIGHTERS_READY]: { from: DayPhase.CREATING, to: DayPhase.READY },
  [DayEventType.BATTLE_STARTED]: { from: DayPhase.READY, to: DayPhase.FIGHTING },
  [DayEventType.BATTLE_FINISHED]: { from: DayPhase.FIGHTING, to: DayPhase.RESULT },
  [DayEventType.REFORGE_REQUESTED]: { from: DayPhase.RESULT, to: DayPhase.DUPLICATE },
  [DayEventType.REFORGE_STARTED]: { from: DayPhase.DUPLICATE, to: DayPhase.REFORGE },
  [DayEventType.COMPLETED]: { from: DayPhase.RESULT, to: DayPhase.END },
  [DayEventType.REFORGE_COMPLETED]: { from: DayPhase.REFORGE, to: DayPhase.END },
}

export function validateDayEvent(day: Day, event: DayEvent): void {
  const { from } = EVENT_TRANSITIONS[event.type]
  if (day.phase !== from) {
    throw new Error(`Cannot handle ${event.type} while day is ${day.phase}`)
  }

  switch (event.type) {
    case DayEventType.NO_OPPONENT:
      if (day.kind !== DayKind.PACTLESS || day.pacts[0] !== null || !day.pacts[1]?.pactless) {
        throw new Error('A no-opponent day must be a Pactless day without a Queenpact')
      }
      break
    case DayEventType.FIGHTERS_READY:
      if (!day.pacts[0] || !day.pacts[1]) {
        throw new Error('Cannot mark day ready without two fighters')
      }
      break
    case DayEventType.BATTLE_STARTED:
      if (!day.pacts[0] || !day.pacts[1]) {
        throw new Error('Cannot start battle without two fighters')
      }
      if (event.battle.p1 !== day.pacts[0] || event.battle.p2 !== day.pacts[1]) {
        throw new Error('Battle fighters do not match the day fighters')
      }
      break
    case DayEventType.BATTLE_FINISHED:
      if (!day.battle) throw new Error('Cannot finish a day without a battle')
      break
    case DayEventType.REFORGE_REQUESTED:
      break
    case DayEventType.REFORGE_STARTED:
      if (!day.reforge) throw new Error('Cannot start reforge without a pending duplicate')
      break
    case DayEventType.COMPLETED:
      if (!day.battle) throw new Error('Cannot complete a day without a battle')
      break
    case DayEventType.REFORGE_COMPLETED:
      if (!day.battle || !day.reforge) {
        throw new Error('Cannot complete reforge without a battle and pending duplicate')
      }
      break
  }
}

export function transitionDay(day: Day, event: DayEvent): void {
  validateDayEvent(day, event)

  switch (event.type) {
    case DayEventType.BATTLE_STARTED:
      day.battle = event.battle
      break
    case DayEventType.REFORGE_REQUESTED:
      day.reforge = event.reforge
      break
    case DayEventType.REFORGE_COMPLETED:
      day.reforgeResult = event.result
      break
  }

  day.phase = EVENT_TRANSITIONS[event.type].to
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
  const day: Day = {
    id,
    kind,
    tier,
    pacts: [...activeFighters],
    phase: DayPhase.CREATING,
    battle: null,
    reforge: null,
    reforgeResult: null,
  }

  if (activeFighters.every(Boolean)) {
    day.phase = DayPhase.READY
  } else if (kind === DayKind.PACTLESS && activeFighters[0] === null) {
    transitionDay(day, { type: DayEventType.NO_OPPONENT })
  }

  return day
}
