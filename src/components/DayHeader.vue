<script setup lang="ts">
import LayoutBlock from '@/components/layouts/LayoutBlock.vue'
import type { Day } from '@/domain/day'
import { TIERS, type TierKey } from '@/utils/constants'

const { day } = defineProps<{ day: Day }>()
</script>

<template>
  <LayoutBlock class="block">
    <h2>
      <span class="title">Day {{ day.id }}</span>
      <span v-if="day.tier" class="color-main">✦ {{ TIERS[day.tier as TierKey] }} fight ✦</span>
    </h2>
  </LayoutBlock>
</template>

<style scoped>
.block {
  padding: 1rem;
}

h2 {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  min-width: 8rem;
  gap: 1ch;
}

.title {
  font-size: 2rem;
  line-height: 2rem;
}
</style>
