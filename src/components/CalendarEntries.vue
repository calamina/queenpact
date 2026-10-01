<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'

const store = useGameStore()
const id = computed(() => store.activeDay?.id ?? 1)

const calendar = computed<{ dayId?: number; message: string; effect?: string }[]>(() => [
  { dayId: id.value, message: 'yoyoyo' },
  { dayId: id.value + 10, message: 'Dream Curse', effect: '???' },
  { dayId: id.value + 15, message: 'Blood Moon', effect: '+100% CRIT' },
  { dayId: id.value + 20, message: 'Forgemaster', effect: 'reforge x2' },
])
</script>

<template>
  <div class="calendar" v-if="store.activeDay">
    <h2 class="low">[Calendar]</h2>
    <div v-for="(entry, index) in calendar" :key="entry.dayId" class="entry">
      <span class="low" v-if="entry.dayId && index !== 0">
        In {{ entry.dayId - store.activeDay?.id }} day{{
          entry.dayId - store.activeDay?.id > 1 ? 's' : ''
        }}
      </span>
      <!-- <span class="low" v-if="entry.dayId && index !== 0"> Day {{ entry.dayId }} </span> -->
      <span v-if="index === 0">TODAY (Day {{ entry.dayId }})</span>
      <p class="message">{{ entry.message }}</p>
      <p class="message color-main" v-if="entry.effect">{{ entry.effect }}</p>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  padding: 1rem;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
}

.entry:first-of-type {
  background-color: #0000000a;
  padding: 1ch;
}
</style>
