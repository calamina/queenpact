<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Item, type ReforgeResult } from '@/domain/item'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { sleep } from '@/utils/utils.ts'
import ItemCard from './ItemCard.vue'

const { current, reward, result, autofight, blitz } = defineProps<{
  current: Item
  reward: Item
  result: ReforgeResult | null
  autofight: boolean
  blitz: boolean
}>()

const emit = defineEmits<{
  reforge: []
}>()

const reforging = ref(false)

async function handleReforge() {
  if (reforging.value || result) return
  reforging.value = true
  if (!blitz) await sleep(1500)
  emit('reforge')
  reforging.value = false
}

onMounted(() => {
  if (autofight) handleReforge()
})
</script>

<template>
  <div class="items">
    <ItemCard :item="current" :disabled="result" label="current" />

    <LayoutBlock v-if="!result" class="center">
      <span v-if="reforging" class="status forging" aria-label="Reforging"></span>
      <button v-else class="bg-main" @click="handleReforge">Reforge</button>
    </LayoutBlock>
    <ItemCard v-else class="result center" :item="result.item" :label="result.message" />

    <ItemCard :item="reward" :disabled="result" label="stolen" />
  </div>
</template>

<style scoped>
.items {
  display: grid;
  grid-template-columns: 1fr 40% 1fr;
  width: 100%;
  justify-content: center;
}

.center {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  width: 100%;
  padding: 1rem;
  text-align: center;
  padding: 0;
  background-color: #00000014;
}

.result {
  padding: 1rem;
}

button {
  width: 100%;
  height: 100%;
}

.status {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--bg-main-up);
  transform: rotate(45deg);

  &.forging {
    animation: forging 0.75s cubic-bezier(0.6, 0, 0.6, 1) infinite;
  }
}

@keyframes forging {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
</style>
