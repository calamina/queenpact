<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, onMounted, ref } from 'vue'
import type { DaySnapshot } from '@/domain/day'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { day } = defineProps<{
  day: DaySnapshot
}>()

const nexted = ref(false)

const MESSAGES = {
  victory: 'The winner went home to rest',
  stalemate: 'They fell in love !!',
  unfortunate: 'They were brave fighters',
  _: '???',
} as const

const store = useGameStore()

const outcome = computed<keyof typeof MESSAGES | undefined>(() => {
  const nextOutcome = day.battle?.outcome
  return nextOutcome ? (nextOutcome as keyof typeof MESSAGES) : undefined
})
const message = computed(() => MESSAGES[outcome.value ?? '_'])

const next = async () => {
  nexted.value = true
  // Holy shit this makes blitz go TURBO
  if (!store.blitz) await new Promise((r) => setTimeout(r, 500))
  // Slows down the beast
  // if (store.blitz) await new Promise((r) => setTimeout(r, 300))
  store.startNewDay()
}

onMounted(() => {
  if (store.autofight) next()
})
</script>

<template>
  <LayoutBlock class="next">
    <button v-if="!nexted" @click="next()">Start the next day</button>
    <div class="finished" v-else>
      <p class="ended">The day has ended ...</p>
      <p>{{ message }}</p>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.next {
  height: 100%;
  display: grid;
  width: 24rem;
  place-items: center;
}

.finished {
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
}

.ended {
  background-color: #0000000a;
}

button,
p {
  padding: 1rem;
  width: 100%;
}

button {
  background-color: #6a5acd44;
}

p {
  text-align: center;
}
</style>
