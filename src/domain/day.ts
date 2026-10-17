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

type EventType = DayEvent['type']
type EventOf<T extends EventType> = Extract<DayEvent, { type: T }>
type EventTransition<T extends EventType> = {
  from: DayPhase
  to: DayPhase
  validate?: (day: Day, event: EventOf<T>) => void
  apply?: (day: Day, event: EventOf<T>) => void
}

const EVENT_TRANSITIONS: { [T in EventType]: EventTransition<T> } = {
  [DayEventType.NO_OPPONENT]: {
    from: DayPhase.CREATING,
    to: DayPhase.NO_OPPONENT,
    validate: (day) => {
      if (
        day.kind !== DayKind.PACTLESS ||
        day.pacts[0] !== null ||
        !day.pacts[1]?.pactless ||
        day.battle ||
        day.reforge ||
        day.reforgeResult
      ) {
        throw new Error('A no-opponent day must be a Pactless day without a Queenpact')
      }
    },
  },
  [DayEventType.FIGHTERS_READY]: {
    from: DayPhase.CREATING,
    to: DayPhase.READY,
    validate: (day) => {
      if (!day.pacts[0] || !day.pacts[1] || day.battle || day.reforge || day.reforgeResult) {
        throw new Error('Cannot mark day ready without two fighters')
      }
    },
  },
  [DayEventType.BATTLE_STARTED]: {
    from: DayPhase.READY,
    to: DayPhase.FIGHTING,
    validate: (day, event) => {
      if (!day.pacts[0] || !day.pacts[1]) {
        throw new Error('Cannot start battle without two fighters')
      }
      if (
        event.battle.resolved ||
        event.battle.p1 !== day.pacts[0] ||
        event.battle.p2 !== day.pacts[1] ||
        day.reforge ||
        day.reforgeResult
      ) {
        throw new Error('Battle fighters do not match the day fighters')
      }
    },
    apply: (day, event) => {
      day.battle = event.battle
    },
  },
  [DayEventType.BATTLE_FINISHED]: {
    from: DayPhase.FIGHTING,
    to: DayPhase.RESULT,
    validate: (day) => {
      if (!day.battle?.resolved || day.reforge || day.reforgeResult) {
        throw new Error('Cannot finish a day without a resolved battle')
      }
    },
  },
  [DayEventType.REFORGE_REQUESTED]: {
    from: DayPhase.RESULT,
    to: DayPhase.DUPLICATE,
    validate: (day, event) => {
      const winner = day.battle?.winner
      if (!day.battle?.resolved || !winner || winner.pactless) {
        throw new Error('Cannot request reforge without a resolved Queenpact winner')
      }
      if (!winner.items.some((item) => item === event.reforge.current)) {
        throw new Error('Reforge item does not belong to the battle winner')
      }
      if (day.reforge || day.reforgeResult) {
        throw new Error('Cannot request reforge when a reforge is already present')
      }
    },
    apply: (day, event) => {
      day.reforge = event.reforge
    },
  },
  [DayEventType.REFORGE_STARTED]: {
    from: DayPhase.DUPLICATE,
    to: DayPhase.REFORGE,
    validate: (day) => {
      if (!day.battle?.resolved || !day.reforge) {
        throw new Error('Cannot start reforge without a resolved battle and pending duplicate')
      }
      if (day.reforgeResult) throw new Error('Cannot start reforge after it has been completed')
    },
  },
  [DayEventType.COMPLETED]: {
    from: DayPhase.RESULT,
    to: DayPhase.END,
    validate: (day) => {
      if (!day.battle?.resolved || day.reforge || day.reforgeResult) {
        throw new Error('Cannot complete a day without a resolved battle')
      }
    },
  },
  [DayEventType.REFORGE_COMPLETED]: {
    from: DayPhase.REFORGE,
    to: DayPhase.END,
    validate: (day) => {
      if (!day.battle?.resolved || !day.reforge || day.reforgeResult) {
        throw new Error('Cannot complete reforge without a resolved battle and pending duplicate')
      }
    },
    apply: (day, event) => {
      day.reforgeResult = event.result
    },
  },
}

export function validateDayEvent<T extends EventType>(day: Day, event: EventOf<T>): void {
  const transition = EVENT_TRANSITIONS[event.type]
  if (day.phase !== transition.from) {
    throw new Error(`Cannot handle ${event.type} while day is ${day.phase}`)
  }
  transition.validate?.(day, event)
}

export function transitionDay<T extends EventType>(day: Day, event: EventOf<T>): void {
  const transition = EVENT_TRANSITIONS[event.type]
  validateDayEvent(day, event)
  transition.apply?.(day, event)
  day.phase = transition.to
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
  return {
    id,
    kind,
    tier,
    pacts: [...activeFighters],
    phase: DayPhase.CREATING,
    battle: null,
    reforge: null,
    reforgeResult: null,
  }
}
