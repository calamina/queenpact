import { createPact, levelUpPact, type Pact } from '@/domain/pact'
import type { Battle } from '@/domain/battle'
import type { Item } from '@/domain/item'

export type BattleQueue = {
  queues: Record<number, Pact[]>
}

export function addFighterToQueue(queue: BattleQueue, fighter: Pact): void {
  const tier = fighter.wins
  if (!queue.queues[tier]) queue.queues[tier] = []
  queue.queues[tier].push(fighter)
}

export function removeFighterFromQueue(queue: BattleQueue, fighterId: string): void {
  for (const tier in queue.queues) {
    queue.queues[tier] = (queue.queues[tier] ?? []).filter((fighter) => fighter.id !== fighterId)
  }
}

function applyReforgedItem(fighter: Pact, reforgedItem: Item): void {
  const itemIndex = fighter.items.findIndex((item) => item.type === reforgedItem.type)
  if (itemIndex === -1) throw new Error(`Cannot apply reforged item: no ${reforgedItem.type} item on next fighter`)
  fighter.items[itemIndex] = reforgedItem
}

export function updateQueueWithBattle(queue: BattleQueue, battle: Battle, reforgedItem?: Item): void {
  const { winner, p1, p2, rewards } = battle
  if (!p1 || !p2) return

  removeFighterFromQueue(queue, p1.id)
  removeFighterFromQueue(queue, p2.id)

  if (winner) {
    const nextFighter = createPact(winner)
    levelUpPact(nextFighter, rewards)
    if (reforgedItem) applyReforgedItem(nextFighter, reforgedItem)
    addFighterToQueue(queue, nextFighter)
  }
}

export function getQueueEntry(queue: BattleQueue, tier: number): [Pact, Pact] | null {
  const entries = queue.queues[tier]
  if (entries && entries.length >= 2) {
    const [f1, f2] = entries
    if (f1 && f2) return [f1, f2]
  }
  return null
}

export function getAvailableQueueTier(queue: BattleQueue): number | null {
  const sortedTiers = Object.keys(queue.queues)
    .map(Number)
    .sort((a, b) => a - b)

  return sortedTiers.find((tier) => (queue.queues[tier]?.length ?? 0) >= 2) ?? null
}

export function createBattleQueue(): BattleQueue {
  return {
    queues: {},
  }
}
