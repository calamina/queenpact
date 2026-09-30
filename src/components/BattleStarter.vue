<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, onMounted, ref } from 'vue'
import { DayPhase, isLiveDay, startDayBattle, type ActiveDay, type DaySnapshot } from '@/domain/day'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { day } = defineProps<{
  day: ActiveDay | DaySnapshot
}>()

const store = useGameStore()
const started = ref(!isLiveDay(day) || day.phase >= DayPhase.FIGHTING)

function handleStart() {
  if (!isLiveDay(day)) return
  started.value = true
  if (store.activeDay) startDayBattle(store.activeDay)
}

const resultMessage = computed(() =>
  day.phase === DayPhase.FIGHTING ? 'They are squaring up !' : 'The fight ended ...',
)

onMounted(() => {
  if (store.autofight && isLiveDay(day)) handleStart()
})
</script>

<template>
  <LayoutBlock class="fight">
    <div class="box">
      <button v-if="!started" @click="handleStart">Fight</button>
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

button {
  background-color: #6a5acd44;
}

button,
p {
  position: relative;
  padding: 1rem;
  width: 100%;
  text-align: center;
}
</style>
