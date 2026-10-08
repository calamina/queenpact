<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator'
import { onMounted } from 'vue'

const store = useGameStore()

const emit = defineEmits<{
  (e: 'id', id: string, name: string): void
}>()

const id = window.crypto.randomUUID()

const name = uniqueNamesGenerator({
  dictionaries: [names, adjectives],
  separator: ' the ',
  length: 2,
  style: 'capital',
  seed: 0,
})

onMounted(() => {
  if (store.autofight) emit('id', id, name)
})
</script>

<template>
  <button @click="$emit('id', id, name)">
    <span class="low">You sense a presence ...</span>
    <span class="pact">Form a pact</span>
  </button>
</template>

<style scoped>
button {
  width: 100%;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  /* background-color: #6a5acd44; */

  &:hover .pact,
  &:focus-visible .pact {
    gap: 2ch;
    color: var(--color-main);
  }
}

.pact {
  display: flex;
  gap: 1ch;
  transition: gap 0.125s ease-out;
  &::before,
  &::after {
    opacity: 0.35;
    content: '—';
  }
}
</style>
