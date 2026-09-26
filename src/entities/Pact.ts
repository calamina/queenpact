import { ref, reactive } from 'vue'
import { useStats } from '@/entities/Stats'
import { FIGHT } from '@/utils/constants'
import type { StatType } from '@/entities/Stat'
import { reforgeItem, useItem, type Item } from './Item'
import type { BattleRewards } from './Battle'

export type Pact = ReturnType<typeof usePact>

export function usePact(source: {
  id: string
  name: string
  items: Array<{ name: string; type: StatType; value: number; tier?: number }>
  stats: any
  wins?: number
}) {
  const id = source.id
  const name = source.name
  const wins = ref(source.wins ?? 0)
  const items = ref(source.items.map((item) => useItem(item)))
  const stats = reactive(useStats(source.stats))

  function stealRandomItem(): Item | null {
    if (Math.random() > 2 / 3) return null

    const randomIndex = Math.floor(Math.random() * items.value.length)
    const [stolenItem] = items.value.splice(randomIndex, 1)
    return stolenItem ?? null
  }

  function receiveItem(incomingItem: Item): Item {
    let currentItem = incomingItem

    while (true) {
      const existingIndex = items.value.findIndex((item) => item.type === currentItem.type)
      if (existingIndex !== -1) {
        const [existingItem] = items.value.splice(existingIndex, 1)
        if (existingItem) {
          currentItem = reforgeItem(existingItem, currentItem)
        }
      } else {
        break
      }
    }

    items.value.push(currentItem)
    return currentItem
  }

  function updateStats(): void {
    const statKeys: StatType[] = ['HP', 'ATK', 'DEF']

    statKeys.forEach((key) => {
      const stat = stats[key]
      stat.bonus = items.value.reduce((sum, item) => sum + (item.type === key ? item.value : 0), 0)
      stat.recalculate()
    })

    wins.value++
  }

  function applyDamage(attacker: Pact): void {
    const atk = attacker.stats.ATK.total
    const def = stats.DEF.total

    if (atk <= def) return

    const rawDmg = atk * (FIGHT.MITIGATION_K / (def + FIGHT.MITIGATION_K))
    const dmg = Math.round(rawDmg)

    stats.HP.current = Math.max(0, stats.HP.current - dmg)
  }

  function levelUp(rewards: BattleRewards) {
    if (rewards.stat) stats[rewards.stat.type].experience += rewards.stat.value
    if (rewards.item) receiveItem(rewards.item)

    updateStats()
    stats.HP.current = stats.HP.total
  }

  return reactive({
    id,
    name,
    wins,
    items,
    stats,
    stealRandomItem,
    receiveItem,
    updateStats,
    applyDamage,
    levelUp,
  })
}
