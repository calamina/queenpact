import { createStat, rollStat, type Stat, type StatSource, type StatType } from '@/domain/stat'

export interface Stats {
  HP: Stat
  ATK: Stat
  DEF: Stat
}
export type StatsSource = Partial<Record<StatType, StatSource>>

export function createStats(source?: StatsSource): Stats {
  const raw = source ?? {}

  return {
    HP: createStat(raw.HP ?? { type: 'HP' }),
    ATK: createStat(raw.ATK ?? { type: 'ATK' }),
    DEF: createStat(raw.DEF ?? { type: 'DEF' }),
  }
}

export function toStatsArray(stats: Stats): Stat[] {
  return [stats.HP, stats.ATK, stats.DEF]
}

export function rollAllStats(stats: Stats): void {
  rollStat(stats.HP)
  rollStat(stats.ATK)
  rollStat(stats.DEF)
}
