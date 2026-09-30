import { DICES } from '@/utils/constants'

export type StatType = 'HP' | 'ATK' | 'DEF'
export type Stat = {
  type: StatType
  base: number
  bonus: number
  experience: number
  current: number
  values: number[]
  isRolling: boolean
  total: number
  dices: number
  d: number
}

export type StatSource = {
  type?: StatType
  base?: number
  total?: number
  bonus?: number
  experience?: number
  current?: number
  values?: number[]
  isRolling?: boolean
}

export const calculateStatTotal = (base: number, bonus: number, experience: number): number =>
  base + bonus + experience

const rollStatValues = (type: StatType): { values: number[]; base: number } => {
  const config = DICES[type] || { dices: 1, d: 6 }
  const values: number[] = []
  let sum = 0

  for (let i = 0; i < config.dices; i++) {
    const rollVal = Math.floor(Math.random() * config.d) + 1
    values.push(rollVal)
    sum += rollVal
  }

  return {
    values,
    base: config.dices > 1 ? sum - Math.min(...values) : sum,
  }
}

export function createStat(source: StatSource = {}): Stat {
  const type: StatType = source.type || 'HP'
  const config = DICES[type] || { dices: 1, d: 6 }
  const base = source.base ?? source.total ?? 0
  const bonus = source.bonus ?? 0
  const experience = source.experience ?? 0
  const total = calculateStatTotal(base, bonus, experience)

  return {
    type,
    base,
    bonus,
    experience,
    current: source.current ?? total,
    values: source.values ? [...source.values] : [],
    isRolling: source.isRolling ?? false,
    total,
    dices: config.dices,
    d: config.d,
  }
}

export function recalculateStat(stat: Stat): void {
  stat.total = calculateStatTotal(stat.base, stat.bonus, stat.experience)
}

export function rollStat(stat: Stat): void {
  const rolled = rollStatValues(stat.type)
  stat.values = rolled.values
  stat.base = rolled.base
  recalculateStat(stat)
  stat.current = stat.total
}

export function addStatExperience(stat: Stat, amount: number) {
  stat.experience += amount
}

export function decreaseCurrentStat(stat: Stat, amount: number) {
  stat.current = Math.max(0, stat.current - amount)
}

export function refillStat(stat: Stat): void {
  stat.current = stat.total
}
