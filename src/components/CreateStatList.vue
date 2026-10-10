<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStatRoll } from '@/composables/useStatRoll'
import { useGameStore } from '@/stores/game'
import { toStatsArray, type Stats } from '@/domain/stats'
import CreateStat from './CreateStat.vue'
import { sleep } from '@/utils/utils.ts'

const emit = defineEmits<{
  (e: 'stats', stats: Stats): void
}>()
const store = useGameStore()
const { stats, rollAllStats } = useStatRoll(() => store.blitz)
const time = computed(() => (store.blitz ? 0 : 400))

onMounted(async () => {
  await sleep(time.value)
  const result = await rollAllStats()
  emit('stats', result)
})
</script>

<template>
  <div>
    <p class="low">They seem strong</p>
    <div class="stats-container">
      <CreateStat v-for="stat in toStatsArray(stats)" :key="stat.type" :stat="stat" />
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
