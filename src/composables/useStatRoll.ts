import { ref } from 'vue'
import { useStats, type Stats } from '@/entities/Stats'
import { useStore } from '@/composables/useStore'
import { DICES } from '@/utils/constants'
import type { StatType } from '@/entities/Stat'

const rollD = (sides: number) => Math.floor(Math.random() * sides) + 1
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useStatRoll() {
  const store = useStore()
  const isComplete = ref(false)

  const stats = ref(useStats())

  const rollAllStats = async (): Promise<Stats> => {
    isComplete.value = false
    const keys: StatType[] = ['HP', 'ATK', 'DEF']

    if (store.blitz) {
      stats.value.rollAll()
    } else {
      for (const key of keys) {
        const stat = stats.value[key]
        stat.isRolling = true
        stat.values = []

        await delay(500)

        const config = DICES[stat.type]
        if (!config) return stats.value
        const tempValues: number[] = []

        for (let i = 0; i < config.dices; i++) {
          tempValues.push(rollD(config.d))
          stat.values = [...tempValues]
          await delay(150)
        }

        const sum = stat.values.reduce((a, b) => a + b, 0)
        stat.base = config.dices > 1 ? sum - Math.min(...stat.values) : sum
        stat.recalculate()
        stat.current = stat.total
        stat.isRolling = false
      }
    }

    isComplete.value = true
    return stats.value
  }

  return { stats, isComplete, rollAllStats }
}
