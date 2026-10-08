<script setup lang="ts">
import { ref } from 'vue'
import { type Item, type ReforgeResult } from '@/domain/item'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { sleep } from '@/utils/utils.ts'

const { current, reward, result } = defineProps<{
  current: Item
  reward: Item
  result: ReforgeResult | null
}>()

const emit = defineEmits<{
  reforge: []
}>()

const reforging = ref(false)

async function handleReforge() {
  if (reforging.value || result) return
  reforging.value = true
  await sleep(1500)
  emit('reforge')
  reforging.value = false
}
</script>

<template>
  <div class="items">
    <LayoutBlock class="item">
      <p class="low">Current</p>
      <p :class="{ low: result, cross: result }">{{ current.name }}</p>
      <p :class="{ low: result, 'color-item': !result }">
        ({{ current.value }} {{ current.type }})
      </p>
    </LayoutBlock>

    <LayoutBlock class="center">
      <div v-if="result" class="result">
        <p class="prompt low" v-if="result.outcome === 'great'">Great reforge!</p>
        <p class="prompt low" v-else-if="result.outcome === 'failure'">
          Failed, your item weakened
        </p>
        <p class="prompt low" v-else>Classic reforge</p>
        <p>{{ result.item.name }} <template v-for="_ in result.item.tier - 1">*</template></p>
        <p class="color-item">({{ result.item.value }} {{ result.item.type }})</p>
      </div>
      <span v-else-if="reforging" class="status forging" aria-label="Reforging"></span>
      <button v-else class="bg-main" @click="handleReforge">Reforge</button>
    </LayoutBlock>

    <LayoutBlock class="item">
      <p class="low">Stolen</p>
      <p :class="{ low: result, cross: result }">{{ reward.name }}</p>
      <p :class="{ low: result, 'color-item': !result }">({{ reward.value }} {{ reward.type }})</p>
    </LayoutBlock>
  </div>
</template>

<style scoped>
.items {
  display: grid;
  grid-template-columns: 1fr 40% 1fr;
  width: 100%;
  justify-content: center;
}

.item,
.center {
  display: flex;
  flex-flow: column;
  min-width: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.center {
  text-align: center;
  padding: 0;
  background-color: #00000014;
  width: 100%;
}

.result {
  padding: 1rem;
}

.cross {
  text-decoration: line-through;
}

button {
  width: 100%;
  height: 100%;
}

.prompt {
  text-align: center;
  width: 100%;
}

.status {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--bg-main-up);
  transform: rotate(45deg);

  &.forging {
    animation: forging 1.5s cubic-bezier(0.6, 0, 0.6, 1) infinite;
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
