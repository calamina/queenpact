import { snapshotStats, createStats, type StatsSnapshot, type StatsSource } from '@/domain/stats'
import { FIGHT } from '@/utils/constants'
import type { StatType } from '@/domain/stat'
import {
  reforgeItem,
  snapshotItem,
  createItem,
  type Item,
  type ItemSource,
  type ItemSnapshot,
} from '@/domain/item'
import type { BattleRewards } from '@/domain/battle'

export type Pact = {
  id: string
  name: string
  wins: number
  items: Item[]
  stats: ReturnType<typeof createStats>
}

export type PactDisplay = {
  readonly id: string
  readonly name: string
  readonly items: ReadonlyArray<ItemSnapshot>
  readonly stats: StatsSnapshot
}

export type PactSnapshot = PactDisplay & { readonly wins: number }
export type PactSource = {
  id: string
  name: string
  items: readonly ItemSource[]
  stats: StatsSource
  wins?: number
}

export function createPact(source: PactSource): Pact {
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

export function receiveItemOnPact(pact: Pact, incomingItem: Item): Item {
  let currentItem = incomingItem

  while (true) {
    const existingIndex = pact.items.findIndex((item) => item.type === currentItem.type)
    if (existingIndex !== -1) {
      const [existingItem] = pact.items.splice(existingIndex, 1)
      if (existingItem) {
        currentItem = reforgeItem(existingItem, currentItem)
      }
    } else {
      break
    }
  }

  pact.items.push(currentItem)
  return currentItem
}

export function updatePactStats(pact: Pact): void {
  const statKeys: StatType[] = ['HP', 'ATK', 'DEF']

  statKeys.forEach((key) => {
    const stat = pact.stats[key]
    stat.bonus = getPactItemBonus(pact, key)
    stat.total = stat.base + stat.bonus + stat.experience
  })

  pact.wins += 1
}

export function applyDamageToPact(attacker: Pact, defender: Pact): void {
  const damage = calculatePactDamage(attacker, defender)
  defender.stats.HP.current = Math.max(0, defender.stats.HP.current - damage)
}

export function levelUpPact(pact: Pact, rewards: BattleRewards): void {
  if (rewards.stat) pact.stats[rewards.stat.type].experience += rewards.stat.value
  if (rewards.item) receiveItemOnPact(pact, rewards.item)

  updatePactStats(pact)
  pact.stats.HP.current = pact.stats.HP.total
}

export function snapshotPact(pact: Pact): PactSnapshot {
  return {
    id: pact.id,
    name: pact.name,
    wins: pact.wins,
    items: pact.items.map(snapshotItem),
    stats: snapshotStats(pact.stats),
  }
}
