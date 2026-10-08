<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const { journal } = useGameStore()
</script>

<template>
  <div class="journal low" v-if="journal.length">
    <h2>[Journal]</h2>
    <div v-for="entry in journal" :key="entry.dayId" class="entry">
      <span v-if="entry.dayId"> Day {{ entry.dayId }} </span>
      <p class="message">{{ entry.message }}</p>
    </div>
  </div>
</template>

<style scoped>
.journal {
  padding: 1rem;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  margin-top: auto;
}

.message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p,
span {
  line-height: 1.4;
}

/* .entry:nth-last-of-type(5) {
  opacity: 0.1;
}
.entry:nth-last-of-type(4) {
  opacity: 0.3;
}
.entry:nth-last-of-type(3) {
  opacity: 0.4;
}
.entry:nth-last-of-type(2) {
  opacity: 0.6;
} */
</style>
