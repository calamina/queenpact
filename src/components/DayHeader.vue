<script setup lang="ts">
import LayoutBlock from '@/components/layouts/LayoutBlock.vue'
import type { Day } from '@/domain/day'
import { TIERS, type TierKey } from '@/utils/constants'

const { day } = defineProps<{ day: Day }>()
</script>

<template>
  <div class="header">
    <h3 v-if="day.id > 1">
      <!-- <span>Day {{ day.id - 1 }}</span> -->
      <span>Full Moon</span>
    </h3>
    <!-- → -->
    <span v-if="day.id > 1" class="low">></span>
    <LayoutBlock class="current">
      <h2>
        <span class="title">Day {{ day.id }}</span>
        <span v-if="day.tier" class="color-main">✦ {{ TIERS[day.tier as TierKey] }} fight ✦</span>
        <span v-else class="low">Regular day</span>
      </h2>
    </LayoutBlock>
    <span class="low">></span>
    <h3>
      <!-- <span>Day {{ day.id + 1 }}</span> -->
      <span>???</span>
    </h3>
  </div>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1ch auto 1ch 1fr;
  place-items: center;
  gap: 4ch;
}

h3 {
  display: flex;
  flex-flow: column;
  width: fit-content;
  height: fit-content;
  gap: 0.25rem;
  opacity: 0.3;

  &:first-of-type {
    justify-self: end;
    /* align-items: end; */
  }
  &:last-of-type {
    justify-self: start;
    /* align-items: start; */
  }
}

.current {
  grid-column: 3;
}

h2 {
  padding: 1.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
  gap: 1ch;

  :first-child {
    font-size: 2rem;
    line-height: 2rem;
  }
}
</style>
