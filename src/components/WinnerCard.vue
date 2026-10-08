<script setup lang="ts">
import type { Pact } from '@/domain/pact'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { STAT_TYPE, type StatType } from '@/domain/stat.ts'
import { TIERS } from '@/utils/constants.ts'

const { pact, hideName } = defineProps<{ pact?: Pact; hideName?: boolean }>()
const statTypes = Object.values(STAT_TYPE)

// base / item / tech
// const symbolMap: Record<StatType, string> = {
//   ATK: '♠',
//   DEF: '♦',
//   HP: '♥',
// }
</script>

<template>
  <LayoutBlock class="pact" v-if="pact">
    <div v-if="!hideName" class="title">
      <p class="low">{{ TIERS[pact.wins as keyof typeof TIERS] }}</p>
      <p class="color-main">{{ pact.name }}</p>
    </div>
    <div class="stats">
      <p class="low">Stats</p>
      <div v-for="stat in pact.stats" :key="stat.type" class="stat">
        <!-- <p class="stat-type low">{{ symbolMap[stat.type] }}</p> -->
        <p class="stat-type">{{ stat.type }}</p>
        <p class="color-main">{{ stat.total }}</p>
        <p class="low">[</p>
        <p class="low">{{ stat.base }}</p>
        <p class="color-item" v-if="stat.bonus !== 0">{{ '+' + stat.bonus }}</p>
        <p class="low" v-else>&#183;</p>
        <p class="color-exp" v-if="stat.experience !== 0">{{ '+' + stat.experience }}</p>
        <p class="low" v-else>&#183;</p>
        <p class="low">]</p>
      </div>
    </div>
    <div>
      <p class="low">Items</p>
      <p v-for="item in pact.items">
        {{ item.name }}
        <!-- <template v-if="item.tier > 1">
          <span v-for="_ in item.tier" class="low">✦</span>&nbsp;
        </template> -->
        <span class="color-item">{{ item.value }} {{ item.type }}</span>
      </p>
    </div>
    <div class="exp">
      <p class="low">Fight experience</p>
      <template v-for="stat in statTypes.map((type) => pact.stats[type])" :key="stat.type">
        <p v-if="stat.experience" class="color-exp">{{ stat.experience }} {{ stat.type }}</p>
      </template>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.pact {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
}

.stats {
  display: grid;
  gap: 0 1ch;
  grid-template-columns: 3ch min-content 1ch 3ch 3ch 3ch 1ch;

  > p {
    grid-column: span 7;
  }
}

.stat {
  grid-column: span 7;
  display: grid;
  grid-template-columns: subgrid;
  /* place-items: center; */
  /* grid-template-columns: 3ch 3ch 1ch 3ch 3ch 3ch 1ch; */

  > p:not(:first-of-type) {
    text-align: center;
  }
}
</style>
