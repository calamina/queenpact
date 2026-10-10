<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const store = useGameStore()
</script>

<template>
  <div class="autofight">
    <button class="autobutton" :class="{ low: !store.autofight }" @click="store.toggleAutofight">
      autofight <span v-if="store.autofight" class="autoanim"></span>
    </button>
    <button class="autobutton" :class="{ low: !store.blitz }" @click="store.toggleBlitz">
      blitz <span v-if="store.blitz" class="autoanim"></span>
    </button>
  </div>
</template>

<style scoped>
.autofight {
  display: flex;
  flex-flow: column;
  gap: 1ch;
  padding: 1rem;
  margin-top: auto;
}

.autobutton {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  background-color: #0000000a;
  opacity: 1;
  gap: 1rem;
  &:hover,
  &:focus-within {
    opacity: 1;
  }
}

.autoanim {
  display: inline-flex;
  height: 0.5rem;
  width: 0.5rem;
  background-color: var(--color-main);
  transform: rotate(45deg);
  animation: autoscroll 1.5s cubic-bezier(0.6, 0, 0.6, 1) infinite;
}

@keyframes autoscroll {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
</style>
