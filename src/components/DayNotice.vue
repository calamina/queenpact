<script setup lang="ts">
import { DayKind, DayPhase, type Day } from '@/domain/day.ts'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { computed } from 'vue'
import { DAY_MESSAGES } from '@/content/messages'

const { day } = defineProps<{ day: Day }>()

const showNotice = computed(() => day.kind === DayKind.TIER || day.kind === DayKind.PACTLESS)
const messages = computed(() => {
  if (day.phase === DayPhase.NO_OPPONENT) return [DAY_MESSAGES.noQueenpact]
  if (day.kind === DayKind.PACTLESS) return [DAY_MESSAGES.pactless]
  return [DAY_MESSAGES.again]
})
</script>

<template>
  <LayoutBlock v-if="showNotice" class="notice">
    <p class="low" v-for="message in messages" :key="message">
      {{ message }}
    </p>
  </LayoutBlock>
</template>

<style scoped>
.notice {
  padding: 1rem;
}

p {
  text-align: center;
}
</style>
