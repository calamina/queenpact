import { markRaw, reactive, ref, toRaw } from 'vue'
import type { Battle } from '@/entities/Battle'
import { usePact, type Pact } from './Pact'

// export type BattleQueue = ReturnType<typeof useBattleQueue>

export function useBattleQueue() {
  const queues = ref<Record<number, Pact[]>>({})

  function add(fighter: Pact): void {
    const tier = fighter.wins
    if (!queues.value[tier]) queues.value[tier] = []
    queues.value[tier].push(fighter)
  }

  function remove(fighterId: string): void {
    for (const tier in queues.value) {
      queues.value[tier] = (queues.value[tier] ?? []).filter((f) => f.id !== fighterId)
    }
  }

  function update(battle: Battle): void {
    const { winner, p1, p2, rewards } = battle
    if (!p1 || !p2) return

    remove(p1.id)
    remove(p2.id)

    if (winner) {
      const nextFighter = usePact({ ...markRaw(winner) })
      nextFighter.levelUp(rewards)
      add(nextFighter)
    }
  }

  function get(tier: number): [Pact, Pact] | null {
    const queue = queues.value[tier]
    if (queue && queue.length >= 2) {
      const [f1, f2] = queue
      if (f1 && f2) return [f1, f2]
    }
    return null
  }

  const getAvailableTier = (): number | null => {
    const sortedTiers = Object.keys(queues.value)
      .map(Number)
      .sort((a, b) => a - b)

    return sortedTiers.find((tier) => (queues.value[tier]?.length ?? 0) >= 2) ?? null
  }

  return reactive({
    queues,
    add,
    remove,
    update,
    get,
    getAvailableTier,
  })
}
