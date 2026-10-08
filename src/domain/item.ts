import type { StatType } from './stat'

export type Item = Readonly<{
  name: string
  type: StatType
  value: number
  tier: number
}>

export type ReforgeOutcome = 'great' | 'classic' | 'failure'

export type DuplicateItemPair = { current: Item; reward: Item }
export type PendingReforge = DuplicateItemPair
export type ReforgeResult = { outcome: ReforgeOutcome; item: Item }

export const REFORGE_CHANCES = {
  great: 0.1,
  failure: 0.15,
  classic: 0.75,
} as const

export const createItem = (source: Item): Item => ({
  name: source.name,
  type: source.type,
  value: source.value,
  tier: source.tier ?? 1,
})

export const checkDuplicateItemTypes = (items: Item[], reward: Item): DuplicateItemPair | null => {
  const existingItem = items.find((item) => item.type === reward.type)
  if (existingItem) {
    return {
      current: existingItem,
      reward,
    }
  } else return null
}

export const combineItemNames = (item1: Item, item2: Item): string => {
  const [adjective1, type1] = item1.name.split(' ')
  const [adjective2, type2] = item2.name.split(' ')

  return Math.random() < 0.5 ? `${adjective1} ${type2}` : `${adjective2} ${type1}`
}

export const reforgeItems = (item1: Item, item2: Item, valueMultiplier = 1): Item => {
  const nextTier = Math.max(item1.tier, item2.tier) + 1
  const sum = item1.value + item2.value
  const avg = sum / 2
  const K = 50
  const dynamicMultiplier = 1 + 0.5 * (K / (avg + K))
  const baseValue = Math.round(sum * dynamicMultiplier)

  return {
    name: combineItemNames(item1, item2),
    type: item1.type,
    value: Math.round(baseValue * valueMultiplier),
    tier: nextTier,
  }
}

const createFailedReforge = (current: Item): ReforgeResult => ({
  outcome: 'failure',
  item: {
    ...current,
    value: Math.max(1, Math.round(current.value * 0.75)),
    tier: current.tier,
  },
})

export const rollReforge = (current: Item, reward: Item): ReforgeResult => {
  const roll = Math.random()

  if (roll < REFORGE_CHANCES.great) {
    return {
      outcome: 'great',
      item: reforgeItems(current, reward, 1.5),
    }
  }

  if (roll >= 1 - REFORGE_CHANCES.failure) return createFailedReforge(current)

  return {
    outcome: 'classic',
    item: reforgeItems(current, reward),
  }
}
