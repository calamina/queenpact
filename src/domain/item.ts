import { adjectives, uniqueNamesGenerator } from 'unique-names-generator'
import { STAT_TYPE, type StatType } from './stat'
import { getRandomInt, randomMinMax } from '@/utils/utils'

export type Item = Readonly<{
  name: string
  type: StatType
  value: number
  tier: number
}>

export type ReforgeOutcome = 'great' | 'classic' | 'failure'

export type DuplicateItemPair = { current: Item; reward: Item }
export type PendingReforge = DuplicateItemPair
export type ReforgeResult = { outcome: ReforgeOutcome; item: Item; message: string }

export const REFORGE_CHANCES = {
  great: 0.1,
  failure: 0.15,
  classic: 0.75,
} as const

const WEAPONS = ['sword', 'bow', 'dagger', 'axe', 'mace', 'knife', 'spear']
const ARMORS = ['mail', 'helm', 'shield', 'cuirass', 'brigandine', 'breastplate', 'buckler']

interface LootEntry {
  type: StatType
  weight: number
  dictionary: string[]
  maxVal: number
}

const LOOT_TABLE: LootEntry[] = [
  { type: STAT_TYPE.ATK, weight: 30, dictionary: WEAPONS, maxVal: 4 },
  { type: STAT_TYPE.HP, weight: 30, dictionary: ARMORS, maxVal: 20 },
  { type: STAT_TYPE.DEF, weight: 40, dictionary: ARMORS, maxVal: 4 },
]

const createItemName = (dictionary: string[]): string => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, dictionary],
    separator: ' ',
    style: 'capital',
  })
}

export const createItem = (): Item => {
  let randomWeight = Math.random() * 100

  let selectedEntry = LOOT_TABLE[0] as LootEntry
  for (const entry of LOOT_TABLE) {
    if (randomWeight < entry.weight) {
      selectedEntry = entry
      break
    }
    randomWeight -= entry.weight
  }

  const name = createItemName(selectedEntry.dictionary)
  const value = getRandomInt(selectedEntry.maxVal)

  return {
    name,
    type: selectedEntry.type,
    value,
    tier: 1,
  }
}

export const duplicateItem = (item: Item): Item => {
  return {
    name: item.name,
    type: item.type,
    value: item.value,
    tier: item.tier,
  }
}

export const createPactlessItem = (item: Item): Item => {
  const artefact = createItem()
  if (item.tier > 1)
    return {
      ...artefact,
      value: Math.max(1, Math.round(randomMinMax(0.7, 1.5) * artefact.value)),
    }

  return artefact
}

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
  message: 'Failed, the item weakened',
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
      message: 'Great reforge!',
      item: reforgeItems(current, reward, 1.5),
    }
  }

  if (roll >= 1 - REFORGE_CHANCES.failure) return createFailedReforge(current)

  return {
    outcome: 'classic',
    message: 'Classic reforge',
    item: reforgeItems(current, reward),
  }
}
