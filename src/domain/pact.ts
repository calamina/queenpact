import {
  createDefaultPactlessStats,
  createPactlessStats,
  createStats,
  type Stats,
} from '@/domain/stats'
import { PACTLESS_NAMES } from '@/content/pactless-names'
import {
  calculateStatTotal,
  decreaseCurrentStat,
  addStatExperience,
  refillStat,
  type StatType,
  STAT_TYPE,
} from '@/domain/stat'
import { createItem, createPactlessItem, duplicateItem, type Item } from '@/domain/item'
import type { BattleRewards } from '@/domain/battle'
import { uniqueNamesGenerator } from 'unique-names-generator'

export type Pact = {
  id: string
  name: string
  wins: number
  items: Item[]
  stats: Stats
  pactless?: boolean
}

export const PACT_TIERS = {
  1: 'Pacten',
  2: 'Qhand',
  3: 'Jjaar',
  4: 'Shand',
  5: 'Strahl',
  6: 'Abstrahl',
  7: 'Myrie',
  8: 'Anda-Myrie',
} as const

export type TierKey = keyof typeof PACT_TIERS

const DAMAGE_MITIGATION_K = 120

export function createPact(
  source: Omit<Pact, 'wins'> & { wins?: number; pactless?: boolean },
): Pact {
  return {
    id: source.id,
    name: source.name,
    wins: source.wins ?? 0,
    items: source.items.map((item) => duplicateItem(item)),
    stats: createStats(source.stats),
    pactless: source.pactless ?? false,
  }
}

export function calculatePactItemBonus(pact: Pact, statType: StatType): number {
  return pact.items.reduce((sum, item) => sum + (item.type === statType ? item.value : 0), 0)
}

export function calculatePactDamage(attacker: Pact, defender: Pact): number {
  const atk = attacker.stats.ATK.total
  const def = defender.stats.DEF.total

  if (atk <= def) return 0

  const rawDmg = atk * (DAMAGE_MITIGATION_K / (def + DAMAGE_MITIGATION_K))
  return Math.round(rawDmg)
}

export function rollStolenItem(pact: Pact): Item | null {
  if (Math.random() > 2 / 3 || pact.items.length === 0) return null

  const randomIndex = Math.floor(Math.random() * pact.items.length)
  const stolenItem = pact.items[randomIndex]

  if (!stolenItem) return null
  return { ...stolenItem }
}

export function updatePactStats(pact: Pact): void {
  const statKeys: StatType[] = Object.values(STAT_TYPE)

  statKeys.forEach((key) => {
    const stat = pact.stats[key]
    stat.bonus = calculatePactItemBonus(pact, key)
    stat.total = calculateStatTotal(stat.base, stat.bonus, stat.experience)
  })
}

export function applyDamageToPact(attacker: Pact, defender: Pact): void {
  const damage = calculatePactDamage(attacker, defender)
  decreaseCurrentStat(defender.stats.HP, damage)
}

export function levelUpPact(pact: Pact, rewards: BattleRewards): void {
  if (rewards.stat) addStatExperience(pact.stats[rewards.stat.type], rewards.stat.value)

  updatePactStats(pact)
  restorePactHealth(pact)
  pact.wins++
}

export function restorePactHealth(pact: Pact) {
  refillStat(pact.stats.HP)
}

export function getPactShortName(pact: Pact | null): string {
  return pact?.name?.split(' ')[0] ?? 'xxx'
}

const createPactlessName = (): string => {
  return uniqueNamesGenerator({
    dictionaries: [PACTLESS_NAMES],
    separator: '',
    style: 'capital',
  })
}

export function createPactless(pact: Pact | null): Pact {
  const items = pact ? pact.items.map((item) => createPactlessItem(item)) : [createItem()]
  const stats = pact?.stats ? createPactlessStats(pact.stats) : createDefaultPactlessStats()

  return {
    id: 'x',
    name: createPactlessName(),
    items,
    stats,
    wins: 0,
    pactless: true,
  }
}
