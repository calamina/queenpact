import {
  createStat,
  recalculateStat,
  refillStat,
  rollStat,
  setPactlessBaseStat,
  STAT_TYPE,
  type Stat,
  type StatType,
} from '@/domain/stat'

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

export function createPactlessStats(stats: Stats): Stats {
  const transformed = {} as Stats
  let exp = 0

  for (const [key, stat] of Object.entries(stats)) {
    if (stat.experience) exp++

    const newStat = {
      ...stat,
      experience: 0,
      base: setPactlessBaseStat(stat.base),
    }
    recalculateStat(newStat)
    refillStat(newStat)
    transformed[key as keyof Stats] = newStat
  }

  if (exp > 0) {
    const randomStat =
      (Object.keys(stats)[Math.floor(Math.random() * 3)] as StatType) ?? STAT_TYPE.HP
    transformed[randomStat].experience = exp
    recalculateStat(transformed[randomStat])
  }

  return transformed
}

export function createDefaultPactlessStats(): Stats {
  const stats = {} as Stats

  ;(Object.keys(STAT_TYPE) as StatType[]).forEach((type) => {
    stats[type] = {
      type: type,
      base: 5,
      bonus: 5,
      experience: 5,
      current: 5,
      total: 15,
    }
  })

  return stats
}
