import { createStat, rollStat, STAT_TYPE, type Stat } from '@/domain/stat'

export interface Stats {
  HP: Stat
  ATK: Stat
  DEF: Stat
}
export function createStats(source: { [K in keyof Stats]?: Partial<Stats[K]> } = {}): Stats {
  return {
    HP: createStat(source.HP ?? { type: STAT_TYPE.HP }),
    ATK: createStat(source.ATK ?? { type: STAT_TYPE.ATK }),
    DEF: createStat(source.DEF ?? { type: STAT_TYPE.DEF }),
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
