<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useStartBattle } from '@/composables/useStartBattle.ts'
import type { Day } from '@/domain/day'
import BattlePact from './BattlePact.vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const props = defineProps<{
  day: Day
  blitz: boolean
}>()

const emit = defineEmits<{
  finished: []
}>()

const { battleState, runBattle, TIMER } = useStartBattle(props.day, {
  blitz: props.blitz,
  onFinished: () => emit('finished'),
})

const firstPact = computed(() => props.day.battle?.p1)
const secondPact = computed(() => props.day.battle?.p2)

const timer = computed(() => TIMER.value.FIGHTING / 1000 + 's')

onMounted(() => runBattle())
</script>

<template>
  <div class="fight">
    <div class="screen" v-if="firstPact && secondPact">
      <BattlePact :pact="firstPact" :key="firstPact.id" />
      <LayoutBlock class="window">
        <span
          class="status"
          :class="{ fighting: battleState === 'FIGHTING', finished: battleState === 'FINISHED' }"
          :style="{ '--timer': timer }"
        ></span>
      </LayoutBlock>
      <BattlePact :pact="secondPact" :key="secondPact.id" />
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
  background-color: var(--bg-main-up);
  transform: rotate(45deg);

  &.fighting {
    animation: fighting var(--timer) cubic-bezier(0.6, 0, 0.6, 1) infinite;
  }
  &.finished {
    background-color: #00000050;
  }
}

@keyframes fighting {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
</style>
