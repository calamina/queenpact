import { ref } from 'vue'
import { createStats, rollAllStats, type Stats } from '@/domain/stats'
import { DICES } from '@/utils/constants'
import { STAT_TYPE, type StatType } from '@/domain/stat'
import { sleep } from '@/utils/utils'

const rollD = (sides: number) => Math.floor(Math.random() * sides) + 1

export function useStatRoll(isBlitz: () => boolean) {
  const isComplete = ref(false)

  const stats = ref(createStats())

  const rollAllStatsAsync = async (): Promise<Stats> => {
    isComplete.value = false
    const keys: StatType[] = Object.values(STAT_TYPE)

    if (isBlitz()) {
      rollAllStats(stats.value)
    } else {
      for (const key of keys) {
        const stat = stats.value[key]
        stat.isRolling = true
        stat.values = []

        await sleep(500)

        const config = DICES[stat.type]
        if (!config) return stats.value
        const tempValues: number[] = []

        for (let i = 0; i < config.dices; i++) {
          tempValues.push(rollD(config.d))
          stat.values = [...tempValues]
          await sleep(150)
        }

        const sum = stat.values.reduce((a, b) => a + b, 0)
        stat.base = config.dices > 1 ? sum - Math.min(...stat.values) : sum
        stat.total = stat.base + stat.bonus + stat.experience
        stat.current = stat.total
        stat.isRolling = false
      }
    }

    isComplete.value = true
    return stats.value
  }

  return { stats, isComplete, rollAllStats: rollAllStatsAsync }
}
