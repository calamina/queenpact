<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { TIERS, type TierKey } from '@/utils/constants'
import { computed, ref } from 'vue'
import WinnerCard from './WinnerCard.vue'
import type { Pact } from '@/domain/pact'

const store = useGameStore()

const sortedTiers = computed(() => {
  return Object.keys(store.winnerQueue.queues)
    .map(Number)
    .filter((tier) => (store.winnerQueue.queues[tier]?.length ?? 0) > 0)
    .sort((a, b) => b - a) as TierKey[]
})

const hasWinners = computed(() => sortedTiers.value.length > 0)

const selectedWinner = ref<Pact | null>(null)
const setSelectedWinner = (pact: Pact) =>
  (selectedWinner.value = selectedWinner.value === pact ? null : pact)
</script>

<template>
  <div class="winners" v-if="hasWinners">
    <div v-for="tier in sortedTiers" :key="tier" class="tier">
      <p class="low">{{ TIERS[tier] }} ({{ tier }} wins)</p>
      <template v-for="pact in store.winnerQueue.queues[tier]" :key="pact.id">
        <button @click="setSelectedWinner(pact)">
          {{ pact.name }}
        </button>
        <WinnerCard
          v-if="selectedWinner && selectedWinner.id === pact?.id"
          :pact="selectedWinner"
          :hideName="true"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.winners {
  display: flex;
  flex-flow: column;
  height: fit-content;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  flex-shrink: 0;
}

.tier-group {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
}

.tier {
  display: flex;
  flex-flow: column;
  width: 100%;

  button {
    text-align: start;
  }
}
</style>
