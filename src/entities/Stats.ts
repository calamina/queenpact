import { reactive } from 'vue'
import { useCreateStat, type Stat, type StatType } from './Stat'

export type Stats = ReturnType<typeof useCreateStats>

export function useCreateStats(source?: Partial<Record<StatType, Stat>>) {
  const raw = source ?? {}

  const HP = useCreateStat(raw.HP ?? { type: 'HP' })
  const ATK = useCreateStat(raw.ATK ?? { type: 'ATK' })
  const DEF = useCreateStat(raw.DEF ?? { type: 'DEF' })

  function toArray(): Stat[] {
    return [HP, ATK, DEF]
  }

  function rollAll(): void {
    HP.roll()
    ATK.roll()
    DEF.roll()
  }

  return reactive({
    HP,
    ATK,
    DEF,
    toArray,
    rollAll,
  })
}
