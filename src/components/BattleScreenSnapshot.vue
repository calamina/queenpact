<script setup lang="ts">
import type { PactDisplay } from '@/domain/pact'
import BattlePact from './BattlePact.vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

defineProps<{
  p1: PactDisplay
  p2: PactDisplay
}>()
</script>

<template>
  <div class="fight">
    <div class="screen">
      <BattlePact :pact="p1" :key="p1.id" />
      <LayoutBlock class="window">
        <span class="status finished"></span>
      </LayoutBlock>
      <BattlePact :pact="p2" :key="p2.id" />
    </div>
  </div>
</template>

<style scoped>
.fight {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.screen {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr 5rem 1fr;
  width: 100%;
}

.window {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;
  padding: 1rem;
  width: 100%;
  background-color: #00000014;
}

.status {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #00000050;
  transform: rotate(45deg);
}
</style>
