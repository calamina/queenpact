import { reactive } from 'vue'
import type { StatType } from './Stat'

export type Item = ReturnType<typeof useItem>

export function useItem(source: { name: string; type: StatType; value: number; tier?: number }) {
  const name = source.name
  const type = source.type
  const value = source.value
  const tier = source.tier !== undefined ? source.tier : 1

  return reactive({
    name,
    type,
    value,
    tier,
  })
}

export function reforgeItem(item1: Item, item2: Item): Item {
  const nextTier = Math.max(item1.tier, item2.tier) + 1
  // const newValue = Math.round((item1.value + item2.value) * 1.25)

  // TODO :: test algo & add to constants
  const sum = item1.value + item2.value
  const avg = sum / 2
  const K = 50
  const dynamicMultiplier = 1 + 0.5 * (K / (avg + K))
  const newValue = Math.round(sum * dynamicMultiplier)

  return useItem({
    name: item1.name, // TODO :: newname
    type: item1.type,
    value: newValue,
    tier: nextTier,
  })
}
