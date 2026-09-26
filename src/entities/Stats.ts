import { reactive } from 'vue'
import { useStat, type Stat, type StatType } from './Stat'

export type Stats = ReturnType<typeof useStats>

export function useStats(source?: Partial<Record<StatType, Stat>>) {
  const raw = source ?? {}

  const HP = useStat(raw.HP ?? { type: 'HP' })
  const ATK = useStat(raw.ATK ?? { type: 'ATK' })
  const DEF = useStat(raw.DEF ?? { type: 'DEF' })

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
