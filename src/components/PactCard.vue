<script setup lang="ts">
import type { Pact } from '@/domain/pact'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { STAT_TYPE } from '@/domain/stat.ts'
import { PACT_TIERS } from '@/domain/pact'

const { pact, hideName } = defineProps<{ pact?: Pact | null; hideName?: boolean }>()
const statTypes = Object.values(STAT_TYPE)
</script>

<template>
  <LayoutBlock class="pact" :class="{ pactless: pact.pactless }" v-if="pact">
    <div v-if="!hideName" class="title">
      <p class="low" v-if="pact.wins">{{ PACT_TIERS[pact.wins as keyof typeof PACT_TIERS] }}</p>
      <p class="low" v-else-if="pact.pactless">Pactless</p>
      <p class="color-main">{{ pact.name }}</p>
    </div>
    <div class="stats">
      <p class="low">{{ pact.pactless ? 'Powers' : 'Stats' }}</p>
      <div v-for="stat in pact.stats" :key="stat.type" class="stat">
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
      <p class="low">{{ pact.pactless ? 'Artefacts' : 'Items' }}</p>
      <p v-for="item in pact.items">
        {{ item.name }}
        <!-- <template v-if="item.tier > 1">
          <span v-for="_ in item.tier" class="low">✦</span>&nbsp;
        </template> -->
        <span class="color-item">{{ item.value }} {{ item.type }}</span>
      </p>
    </div>
    <div class="exp">
      <p class="low">{{ pact.pactless ? 'Dark experience' : 'Fight experience' }}</p>
      <template v-for="stat in statTypes.map((type) => pact.stats[type])" :key="stat.type">
        <p v-if="stat.experience" class="color-exp">{{ stat.experience }} {{ stat.type }}</p>
      </template>
    </div>
  </LayoutBlock>
  <LayoutBlock class="pact nopact" v-else>
    <p class="low">No challenger</p>
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

.nopact {
  display: grid;
  place-items: center;

  p {
    text-align: center;
  }
}

.pact.pactless {
  background-color: var(--bg-pactless);
}
.pact.pactless :deep(.color-main),
.pact.pactless :deep(.color-item),
.pact.pactless :deep(.color-exp) {
  color: var(--color-pactless);
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

  > p:not(:first-of-type) {
    text-align: center;
  }
}
</style>
