import {
  createStat,
  rollStat,
  snapshotStat,
  type Stat,
  type StatSnapshot,
  type StatSource,
  type StatType,
} from '@/domain/stat'

export interface Stats {
  HP: Stat
  ATK: Stat
  DEF: Stat
}
export type StatsSource = Partial<Record<StatType, StatSource>>
export type StatsSnapshot = Readonly<Record<StatType, StatSnapshot>>

const buildStats = (source?: StatsSource) => {
  const raw = source ?? {}

  return {
    HP: createStat(raw.HP ?? { type: 'HP' }),
    ATK: createStat(raw.ATK ?? { type: 'ATK' }),
    DEF: createStat(raw.DEF ?? { type: 'DEF' }),
  }
}

export function createStats(source?: StatsSource): Stats {
  const stats = buildStats(source)
  return {
    HP: stats.HP,
    ATK: stats.ATK,
    DEF: stats.DEF,
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

export function snapshotStats(stats: Stats): StatsSnapshot {
  return {
    HP: snapshotStat(stats.HP),
    ATK: snapshotStat(stats.ATK),
    DEF: snapshotStat(stats.DEF),
  }
}
