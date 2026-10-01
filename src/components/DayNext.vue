<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { onMounted, ref } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const store = useGameStore()
const nexted = ref(false)

const next = async () => {
  nexted.value = true
  if (!store.blitz) await new Promise((r) => setTimeout(r, 500))
  store.startNewDay()
}

onMounted(() => {
  if (store.autofight) next()
})
</script>

<template>
  <LayoutBlock class="next">
    <button v-if="!nexted" @click="next()">Start the next day</button>
    <p v-else class="ended">The day has ended ...</p>
  </LayoutBlock>
</template>

<style scoped>
.next {
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
