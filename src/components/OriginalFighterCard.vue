<script setup lang="ts">
import { computed } from 'vue'
import { createStat } from '@/domain/stat'
import type { PactSnapshot } from '@/domain/pact'
import CreateName from './CreateName.vue'
import CreateStat from './CreateStat.vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { pact } = defineProps<{
  pact: PactSnapshot
}>()

const stats = computed(() =>
  ([pact.stats.HP, pact.stats.ATK, pact.stats.DEF] as const).map((stat) =>
    createStat({ ...stat, values: [...stat.values] }),
  ),
)
</script>

<template>
  <LayoutBlock class="create">
    <div class="pact">
      <CreateName :name="pact.name" />
      <div>
        <p class="low">They seem strong</p>
        <div class="stats-container">
          <CreateStat v-for="stat in stats" :key="stat.type" :stat="stat" />
        </div>
      </div>
      <div class="item" v-if="pact.items.length">
        <p class="low">They possess</p>
        <div v-for="item in pact.items" :key="`${item.name}-${item.type}`" class="info">
          <p class="name">{{ item.name }}</p>
          <span class="color-item value">({{ item.value }} {{ item.type }})</span>
        </div>
      </div>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.create {
  width: 100%;
  position: relative;
  height: fit-content;
  min-height: 22.4rem;
}

.pact {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
  min-height: 4rem;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  display: flex;
  flex-direction: column;
}

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
</style>
