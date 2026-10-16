<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Item, createItem } from '@/domain/item'

const emit = defineEmits<{
  (e: 'item', item: Item): void
}>()

const item = ref<Item>(createItem())
onMounted(() => emit('item', item.value))
</script>

<template>
  <div class="item" v-if="item">
    <p class="low">They possess</p>
    <div class="info">
      <p class="name">{{ item.name }}</p>
      <span class="color-item value">({{ item.value }} {{ item.type }})</span>
    </div>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  gap: 1ch;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value {
  flex-shrink: 0;
}

.item {
  display: flex;
  flex-direction: column;
}
</style>
