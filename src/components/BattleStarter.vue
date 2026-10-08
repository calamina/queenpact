<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DayPhase, type Day } from '@/domain/day'
import LayoutBlock from './layouts/LayoutBlock.vue'

const props = defineProps<{
  day: Day
  autofight: boolean
}>()

const emit = defineEmits<{
  start: []
}>()

const started = ref(props.day.battle !== null)

function handleStart() {
  started.value = true
  emit('start')
}

const resultMessage = computed(() =>
  props.day.phase === DayPhase.FIGHTING ? 'They are squaring up !' : 'The fight ended ...',
)

onMounted(() => {
  if (props.autofight) handleStart()
})
</script>

<template>
  <LayoutBlock class="fight">
    <div class="box">
      <button v-if="!started" @click="handleStart" class="bg-main">Fight</button>
      <p :class="{ low: props.day.phase !== DayPhase.FIGHTING }" v-else>{{ resultMessage }}</p>
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
