import { createPact, levelUpPact, type Pact } from '@/domain/pact'
import type { Battle } from '@/domain/battle'
import type { Item } from '@/domain/item'

export type BattleQueue = {
  queues: Record<number, Pact[]>
}

export const NextFighterItemUpdateType = {
  REWARD: 'reward',
  REFORGE: 'reforge',
} as const

export type NextFighterItemUpdate =
  | { type: typeof NextFighterItemUpdateType.REWARD; item: Item }
  | { type: typeof NextFighterItemUpdateType.REFORGE; item: Item }

export function addFighterToQueue(queue: BattleQueue, fighter: Pact): void {
  const tier = fighter.wins
  if (!queue.queues[tier]) queue.queues[tier] = []
  queue.queues[tier].push(fighter)
}

export function removeFighterFromQueue(queue: BattleQueue, fighterId: string): void {
  for (const tier in queue.queues) {
    queue.queues[tier] = (queue.queues[tier] ?? []).filter((fighter) => fighter.id !== fighterId)
    if (queue.queues[tier].length === 0) delete queue.queues[tier]
  }
}

function applyReforgedItem(fighter: Pact, reforgedItem: Item): void {
  const itemIndex = fighter.items.findIndex((item) => item.type === reforgedItem.type)
  if (itemIndex === -1)
    throw new Error(`Cannot apply reforged item: no ${reforgedItem.type} item on next fighter`)
  fighter.items[itemIndex] = reforgedItem
}

export function advanceQueueAfterBattle(
  queue: BattleQueue,
  battle: Battle,
  itemUpdate?: NextFighterItemUpdate,
): void {
  const { winner, p1, p2, rewards } = battle
  if (!p1 || !p2) return

  removeFighterFromQueue(queue, p1.id)
  removeFighterFromQueue(queue, p2.id)

  if (winner && !winner.pactless) {
    const nextFighter = createPact(winner)
    if (itemUpdate?.type === NextFighterItemUpdateType.REWARD) {
      nextFighter.items.push(itemUpdate.item)
    }
    if (itemUpdate?.type === NextFighterItemUpdateType.REFORGE) {
      applyReforgedItem(nextFighter, itemUpdate.item)
    }
    levelUpPact(nextFighter, rewards)
    addFighterToQueue(queue, nextFighter)
  }
}

export function getFighterPairAtTier(queue: BattleQueue, tier: number): [Pact, Pact] | null {
  const entries = queue.queues[tier]
  if (entries && entries.length >= 2) {
    const [f1, f2] = entries
    if (f1 && f2) return [f1, f2]
  }
  return null
}

export function getHighestTierFighter(queue: BattleQueue): Pact | null {
  const tiers = Object.keys(queue.queues).map(Number)
  if (tiers.length === 0) return null

  const bestTier = Math.max(...tiers)
  return queue.queues[bestTier]?.[0] ?? null
}

export function getTierReadyForBattle(queue: BattleQueue): number | null {
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
