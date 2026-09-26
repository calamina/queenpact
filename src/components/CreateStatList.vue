<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStatRoll } from '@/composables/useStatRoll'
import { useStore } from '@/composables/useStore'
import type { Stats } from '@/entities/Stats'
import CreateStat from './CreateStat.vue'

const emit = defineEmits<{
  (e: 'stats', stats: Stats): void
}>()
const { stats, rollAllStats } = useStatRoll()

const store = useStore()
const time = computed(() => (store.blitz ? 0 : 400))

onMounted(async () => {
  await new Promise((r) => setTimeout(r, time.value))
  const result = await rollAllStats()
  emit('stats', result)
})
</script>

<template>
  <div>
    <p class="low">They seem strong</p>
    <div class="stats-container">
      <CreateStat v-for="stat in stats.toArray()" :key="stat.type" :stat="stat" />
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
