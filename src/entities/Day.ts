import { ref, reactive } from 'vue'
import { usePact, type Pact } from './Pact'
import { useBattle, type Battle } from './Battle'

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

export type Day = ReturnType<typeof useDay>

export function useDay(id: number, tier: number | null, activeFighters: Pact[] = []) {
  const pacts = ref<Pact[]>(activeFighters)
  const phase = ref<DayPhase>(activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING)
  const type = ref<DayType>(activeFighters.length > 0 ? DayType.WINNERSHIP : DayType.CLASSIC)
  const tierRef = ref(tier)

  const battle = ref<Battle | null>(null)

  function addPact(pact: Pact, pactId: number): void {
    pacts.value[pactId - 1] = usePact(pact)
    if (pacts.value.length === 2) {
      phase.value = DayPhase.READY
    }
  }

  function startBattle(): void {
    const [p1, p2] = pacts.value
    if (p1 && p2) {
      battle.value = useBattle(p1, p2)
    }
    phase.value = DayPhase.FIGHTING
  }

  function finish(): void {
    if (!battle.value) return
    battle.value.finish()
    phase.value = DayPhase.RESULT
    phase.value = DayPhase.END
  }

  return reactive({
    id,
    pacts,
    phase,
    type,
    tier: tierRef,
    battle,
    addPact,
    startBattle,
    finish,
  })
}
