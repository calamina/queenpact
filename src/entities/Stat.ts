import { ref, reactive } from 'vue'
import { DICES } from '@/utils/constants'

export type StatType = 'HP' | 'ATK' | 'DEF'
export type Stat = ReturnType<typeof useCreateStat>

export function useCreateStat(source: any = {}) {
  const type: StatType = source.type || 'HP'
  const base = ref(source.base ?? source.total ?? 0)
  const bonus = ref(source.bonus ?? 0)
  const experience = ref(source.experience ?? 0)
  const values = ref(source.values ? [...source.values] : [])
  const isRolling = ref(source.isRolling ?? false)

  const config = DICES[type] || { dices: 1, d: 6 }
  const dices = config.dices
  const d = config.d

  const total = ref(base.value + bonus.value + experience.value)
  const current = ref(source.current ?? total.value)

  function recalculate(): void {
    total.value = base.value + bonus.value + experience.value
  }

  function roll(): void {
    const config = DICES[type] || { dices: 1, d: 6 }
    values.value = []
    let sum = 0

    for (let i = 0; i < config.dices; i++) {
      const rollVal = Math.floor(Math.random() * config.d) + 1
      values.value.push(rollVal)
      sum += rollVal
    }

    base.value = config.dices > 1 ? sum - Math.min(...values.value) : sum
    recalculate()
    current.value = total.value
  }

  return reactive({
    type,
    base,
    bonus,
    experience,
    current,
    values,
    isRolling,
    total,
    dices,
    d,
    recalculate,
    roll,
  })
}
