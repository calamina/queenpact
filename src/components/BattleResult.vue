<script setup lang="ts">
import { computed } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'
import type { BattleOutcome, BattleRewards } from '@/domain/battle'
import type { Pact } from '@/domain/pact'
import { MESSAGES_ACTION, MESSAGES_OUTCOME } from '@/utils/constants.ts'

const { winner, outcome, rewards } = defineProps<{
  winner: Pact | null
  outcome: BattleOutcome
  rewards: BattleRewards
}>()

const outcomeMessage = computed(() => MESSAGES_OUTCOME[outcome ?? '_'])
const actionMessage = computed(() => MESSAGES_ACTION[outcome ?? '_'])
</script>

<template>
  <div class="screen">
    <LayoutBlock v-if="outcome === 'victory' && winner" class="victory">
      <p class="winner">{{ outcomeMessage }}</p>
      <div class="info">
        <p>{{ winner.name }}</p>

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
      <p class="winner">{{ actionMessage }}</p>
    </LayoutBlock>

    <LayoutBlock v-else>
      <p class="winner">{{ outcomeMessage }}</p>
      <p class="info center">{{ actionMessage }}</p>
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
  width: 40%;
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

.center {
  text-align: center;
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
