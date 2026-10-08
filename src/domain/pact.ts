import { createStats, type Stats } from '@/domain/stats'
import { FIGHT } from '@/utils/constants'
import {
  calculateStatTotal,
  decreaseCurrentStat,
  addStatExperience,
  refillStat,
  type StatType,
  STAT_TYPE,
} from '@/domain/stat'
import { createItem, type Item } from '@/domain/item'
import type { BattleRewards } from '@/domain/battle'

export type Pact = {
  id: string
  name: string
  wins: number
  items: Item[]
  stats: Stats
}

export function createPact(source: Omit<Pact, 'wins'> & { wins?: number }): Pact {
  return {
    id: source.id,
    name: source.name,
    wins: source.wins ?? 0,
    items: source.items.map((item) => createItem(item)),
    stats: createStats(source.stats),
  }
}

export function getPactItemBonus(pact: Pact, statType: StatType): number {
  return pact.items.reduce((sum, item) => sum + (item.type === statType ? item.value : 0), 0)
}

export function calculatePactDamage(attacker: Pact, defender: Pact): number {
  const atk = attacker.stats.ATK.total
  const def = defender.stats.DEF.total

  if (atk <= def) return 0

  const rawDmg = atk * (FIGHT.MITIGATION_K / (def + FIGHT.MITIGATION_K))
  return Math.round(rawDmg)
}

export function stealRandomItemFromPact(pact: Pact): Item | null {
  if (Math.random() > 2 / 3 || pact.items.length === 0) return null

  const randomIndex = Math.floor(Math.random() * pact.items.length)
  const stolenItem = pact.items[randomIndex]

  if (!stolenItem) return null
  return { ...stolenItem }
}

// export function receiveItemOnPact(pact: Pact, incomingItem: Item): Item {
//   let currentItem = incomingItem

//   while (true) {
//     const existingItem = pact.items.find((item) => item.type === currentItem.type)
//     if (existingItem) {
//       currentItem = reforgeItem(existingItem, currentItem)
//     } else break
//   }

//   pact.items.push(currentItem)
//   return currentItem
// }

export function updatePactStats(pact: Pact): void {
  const statKeys: StatType[] = Object.values(STAT_TYPE)

  statKeys.forEach((key) => {
    const stat = pact.stats[key]
    stat.bonus = getPactItemBonus(pact, key)
    stat.total = calculateStatTotal(stat.base, stat.bonus, stat.experience)
  })
}

export function applyDamageToPact(attacker: Pact, defender: Pact): void {
  const damage = calculatePactDamage(attacker, defender)
  decreaseCurrentStat(defender.stats.HP, damage)
}

export function levelUpPact(pact: Pact, rewards: BattleRewards): void {
  if (rewards.stat) addStatExperience(pact.stats[rewards.stat.type], rewards.stat.value)
  // if (rewards.item) receiveItemOnPact(pact, rewards.item)

  updatePactStats(pact)
  healPact(pact)
  pact.wins++
}

export function healPact(pact: Pact) {
  refillStat(pact.stats.HP)
}

export function getShortName(pact: Pact | null): string {
  return pact?.name?.split(' ')[0] ?? 'xxx'
}
