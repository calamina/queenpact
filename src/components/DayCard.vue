<script setup lang="ts">
import {
  addPactToDay,
  isLiveDay,
  isSnapshotDay,
  type ActiveDay,
  type DaySnapshot,
} from '@/domain/day'
import type { Pact } from '@/domain/pact'
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue'
import DayHeader from './DayHeader.vue'
import DayCardLive from './DayCardLive.vue'
import DayCardSnapshot from './DayCardSnapshot.vue'

const { day, showNext } = defineProps<{
  day: ActiveDay | DaySnapshot
  showNext: boolean
}>()

const activeDay = computed(() => (isLiveDay(day) ? day : null))
const snapshot = computed(() => (isSnapshotDay(day) ? day : null))

function addPact(pactId: number, pact: Pact) {
  if (!activeDay.value) return
  addPactToDay(activeDay.value, pact, pactId)
}

const emit = defineEmits<{
  (e: 'phase-changed', targetEl: HTMLElement): void
}>()

const card = useTemplateRef('card')

const phaseChanged = async () => {
  await nextTick()
  const lastChild = card.value?.lastElementChild as HTMLElement | null
  if (lastChild) emit('phase-changed', lastChild)
}

onMounted(() => phaseChanged())
watch(() => [activeDay.value?.phase, activeDay.value !== null, showNext], phaseChanged)
</script>

<template>
  <div class="day" ref="card">
    <DayHeader :day="day" />

    <DayCardLive v-if="activeDay" :day="activeDay" @pact-created="addPact" />
    <DayCardSnapshot v-else-if="snapshot" :day="snapshot" :show-next="showNext" />
  </div>
</template>

<style scoped>
.day {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  gap: 1ch;
}
</style>
