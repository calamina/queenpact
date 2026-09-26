<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adjectives, uniqueNamesGenerator } from 'unique-names-generator'
import { type Item, useItem } from '@/entities/Item'
import { getRandomInt } from '@/utils/utils'
import type { StatType } from '@/entities/Stat'

const emit = defineEmits<{
  (e: 'item', item: Item): void
}>()

const WEAPONS = ['sword', 'bow', 'dagger', 'axe', 'mace', 'knife', 'spear']
const ARMORS = ['mail', 'helm', 'shield', 'cuirass', 'brigandine', 'breastplate', 'buckler']

interface LootEntry {
  type: StatType
  weight: number
  dictionary: string[]
  maxVal: number
}

const LOOT_TABLE: LootEntry[] = [
  { type: 'ATK', weight: 30, dictionary: WEAPONS, maxVal: 4 },
  { type: 'HP', weight: 30, dictionary: ARMORS, maxVal: 20 },
  { type: 'DEF', weight: 40, dictionary: ARMORS, maxVal: 4 },
]

const generateItem = (): Item => {
  let randomWeight = Math.random() * 100

  let selectedEntry = LOOT_TABLE[0] as LootEntry
  for (const entry of LOOT_TABLE) {
    if (randomWeight < entry.weight) {
      selectedEntry = entry
      break
    }
    randomWeight -= entry.weight
  }

  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, selectedEntry.dictionary],
    separator: ' ',
    style: 'capital',
  })

  const value = getRandomInt(selectedEntry.maxVal)

  return useItem({
    name,
    type: selectedEntry.type,
    value,
    tier: 1,
  })
}

const item = ref<Item>(generateItem())
onMounted(() => emit('item', item.value))
</script>

<template>
  <div class="item" v-if="item">
    <p class="low">They possess</p>
    <div class="info">
      <p class="name">{{ item.name }}</p>
      <span class="color-item value">({{ item.value }} {{ item.type }})</span>
    </div>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  gap: 1ch;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value {
  flex-shrink: 0;
}

.item {
  display: flex;
  flex-direction: column;
}
</style>
