<script setup lang="ts">
import type { Stat } from '@/domain/stat'

const { stat, i } = defineProps<{
  stat: Stat
  i: number
}>()

const getDroppedIndex = (stat: Stat): number => {
  if (stat.isRolling || stat.dices <= 1 || stat.values.length < stat.dices) return -1
  return stat.values.indexOf(Math.min(...stat.values))
}
</script>

<template>
  <div
    class="dice"
    :style="{
      '--d-sides': stat.d,
      '--speed': `${stat.d / 20}s`,
      '--offset': `-${(stat.d - 1) * 1.8}rem`,
    }"
    :class="{
      dropped: getDroppedIndex(stat) === i - 1,
      rolling: stat.isRolling && stat.values[i - 1] === undefined,
    }"
  >
    <div class="face">
      <template v-if="stat.isRolling && stat.values[i - 1] === undefined">
        <p class="value" v-for="n in stat.d" :key="n">{{ n }}</p>
      </template>
      <p class="value" v-else>{{ stat.values[i - 1] ?? '' }}</p>
    </div>
  </div>
</template>

<style scoped>
.dice {
  width: 1.8rem;
  height: 1.8rem;
  overflow: hidden;
  display: grid;
  place-items: center;
  border: 1px solid #00000035;
  background-color: #0000000a;
  border-radius: 4px;
}

.face {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  width: 1.8rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
}

.dropped {
  opacity: 0.25;
  position: relative;
  pointer-events: none;
}

.dropped::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -6px;
  right: -6px;
  height: 1px;
  background-color: black;
  opacity: 0.5;
  z-index: 2;
  transform: translateY(-50%) rotate(-45deg);
}

.rolling .face {
  animation: roll var(--speed) linear infinite;
}

@keyframes roll {
  100% {
    transform: translateY(var(--offset));
  }
}
</style>
