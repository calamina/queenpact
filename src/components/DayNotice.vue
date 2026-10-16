<script setup lang="ts">
import { DayKind, DayPhase, type Day } from '@/domain/day.ts'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { computed } from 'vue'
import {
  MESSAGE_BATTLE_AGAIN,
  MESSAGE_BATTLE_NO_QUEENPACT,
  MESSAGE_BATTLE_PACTLESS,
} from '@/utils/constants.ts'

const { day } = defineProps<{ day: Day }>()

const showNotice = computed(() => day.kind === DayKind.TIER || day.kind === DayKind.PACTLESS)
const messages = computed(() => {
  if (day.phase === DayPhase.NO_OPPONENT) return [MESSAGE_BATTLE_NO_QUEENPACT]
  if (day.kind === DayKind.PACTLESS) return [MESSAGE_BATTLE_PACTLESS]
  return [MESSAGE_BATTLE_AGAIN]
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
