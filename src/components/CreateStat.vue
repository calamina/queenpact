<script setup lang="ts">
import type { Stat } from '@/entities/Stat'
import CreateStatDice from './CreateStatDice.vue'

const { stat } = defineProps<{
  stat: Stat
}>()
</script>

<template>
  <div class="stat-row">
    <div class="stat-header">
      <span class="name">{{ stat.type }}</span>
      <span v-if="!stat.isRolling && stat.values.length" class="total">({{ stat.total }})</span>
    </div>

    <div class="dice-group">
      <CreateStatDice v-for="i in stat.dices" :stat :i :key="i" />
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 1ch;
}

.total {
  color: slateblue;
}

.dice-group {
  display: flex;
  gap: 0.5rem;
}
</style>
