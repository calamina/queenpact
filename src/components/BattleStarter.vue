<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, onMounted, ref } from 'vue'
import { DayPhase, type Day } from '@/domain/day'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { day } = defineProps<{ day: Day }>()

const store = useGameStore()
const started = ref(day.phase >= DayPhase.FIGHTING)

function handleStart() {
  started.value = true
  store.startDayBattle(day)
}

const resultMessage = computed(() =>
  day.phase === DayPhase.FIGHTING ? 'They are squaring up !' : 'The fight ended ...',
)

onMounted(() => {
  if (store.autofight) handleStart()
})
</script>

<template>
  <LayoutBlock class="fight">
    <div class="box">
      <button v-if="!started" @click="handleStart" class="bg-main">Fight</button>
      <p :class="{ low: day.phase !== DayPhase.FIGHTING }" v-else>{{ resultMessage }}</p>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.fight {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.box {
  width: 100%;
}

button,
p {
  position: relative;
  padding: 1rem;
  width: 100%;
  text-align: center;
}
</style>
