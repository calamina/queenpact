<script setup lang="ts">
import type { Item, ReforgeResult } from '@/domain/item'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { disabled, item, label } = defineProps<{
  item: Item
  label: string
  disabled?: ReforgeResult | null
}>()
</script>
<template>
  <LayoutBlock class="item">
    <p class="low label">{{ label }}</p>
    <p class="name" :class="{ low: disabled, disabled: disabled }">{{ item.name }}</p>
    <p :class="{ low: disabled, 'color-item': !disabled }">({{ item.value }} {{ item.type }})</p>
  </LayoutBlock>
</template>

<style scoped>
.label {
  text-transform: capitalize;
}

.disabled {
  text-decoration: line-through;
}

.name {
  text-align: center;
}

.item {
  display: flex;
  flex-flow: column;
  min-width: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
