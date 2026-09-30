export type Item = Readonly<{
  name: string
  type: StatType
  value: number
  tier: number
}>

export type ItemSource = {
  name: string
  type: StatType
  value: number
  tier?: number
}

export type ItemSnapshot = Readonly<Item>

export type StatType = 'HP' | 'ATK' | 'DEF'

const buildItem = (source: ItemSource): Item => ({
  name: source.name,
  type: source.type,
  value: source.value,
  tier: source.tier ?? 1,
})

const buildReforgedItem = (item1: Item, item2: Item): Item => {
  const nextTier = Math.max(item1.tier, item2.tier) + 1
  const sum = item1.value + item2.value
  const avg = sum / 2
  const K = 50
  const dynamicMultiplier = 1 + 0.5 * (K / (avg + K))

  return {
    name: item1.name,
    type: item1.type,
    value: Math.round(sum * dynamicMultiplier),
    tier: nextTier,
  }
}

export function createItem(source: ItemSource): Item {
  return buildItem(source)
}

export function reforgeItem(item1: Item, item2: Item): Item {
  return buildReforgedItem(item1, item2)
}

export function snapshotItem(item: Item): ItemSnapshot {
  return {
    name: item.name,
    type: item.type,
    value: item.value,
    tier: item.tier,
  }
}
