<script setup lang="ts">
import { computed } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'
import type { BattleOutcome, BattleRewards } from '@/domain/battle'
import type { PactDisplay } from '@/domain/pact'

const { winner, outcome, rewards } = defineProps<{
  winner: PactDisplay | null
  outcome: BattleOutcome
  rewards: BattleRewards
}>()

const MESSAGES = {
  victory: 'Victory !',
  stalemate: 'Their strength matches !',
  unfortunate: 'Everyone met an unfortunate end ...',
  _: '???',
} as const

const resultMessage = computed(() => MESSAGES[outcome ?? '_'])
</script>

<template>
  <div class="screen">
    <LayoutBlock v-if="outcome === 'victory' && winner" class="victory">
      <div class="winner">
        <p>{{ resultMessage }}</p>
      </div>
      <div class="info">
        <p class="color-main">{{ winner.name }}</p>

        <div v-if="rewards?.item">
          <p class="low">They stole an item</p>
          <p>
            {{ rewards.item.name }}
            <span class="color-item">({{ rewards.item.value }} {{ rewards.item.type }})</span>
          </p>
        </div>
        <p v-else class="low">They got nothing ...</p>

        <div v-if="rewards?.stat">
          <p class="low">They learned something</p>
          <p class="color-exp">({{ rewards.stat.value }} {{ rewards.stat.type }})</p>
        </div>
      </div>
    </LayoutBlock>

    <LayoutBlock v-else class="unfortunate">
      {{ resultMessage }}
    </LayoutBlock>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.screen {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
}

.victory {
  display: flex;
  flex-flow: column;
  width: 100%;
}

.info {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
}

.winner {
  text-align: center;
  padding: 1rem;
  background-color: #0000000a;
}

.unfortunate {
  text-align: center;
  text-wrap: balance;
  padding: 1rem;
}
</style>
