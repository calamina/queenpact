<script setup lang="ts">
import type { Pact } from '@/domain/pact'
import { computed } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { pact } = defineProps<{
  pact: Pact
}>()

const vanquished = computed(() => pact.stats.HP.current === 0)
</script>

<template>
  <LayoutBlock class="pact" :class="{ vanquished: vanquished }">
    <div class="info">
      <p class="name">{{ pact.name }}</p>
      <p class="life">
        <span class="color-main">{{ pact.stats.HP.current }}</span>
        <span class="low">/{{ pact.stats.HP.total }}</span>
      </p>
    </div>
    <div
      class="hp"
      :style="{
        '--hp-current': (pact.stats.HP.current / pact.stats.HP.total) * 100 + '%',
      }"
    ></div>
    <div class="info">
      <p>
        <span class="low">{{ 'ATK ' }}</span>
        <span class="color-main">{{ pact.stats.ATK.total }}</span>
      </p>
      <p>
        <span class="low">{{ 'DEF ' }}</span>
        <span class="color-main">{{ pact.stats.DEF.total }}</span>
      </p>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.pact {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  padding: 1rem;
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2ch;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.life {
  flex-shrink: 0;
}

.hp {
  height: 8px;
  border-radius: 4px;
  position: relative;
  overflow: clip;
  background-color: #00000018;

  &:after {
    content: '';
    display: block;
    position: absolute;
    background-color: var(--bg-main-up);
    height: 100%;
    width: var(--hp-current);
    transition: width 0.125s ease-out;
  }
}

.vanquished {
  .color-main,
  .low,
  .name {
    color: #000;
    opacity: 0.25;
  }
}
</style>
