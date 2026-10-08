<script setup lang="ts">
const { name } = defineProps<{
  name: string
}>()
</script>

<template>
  <div>
    <p class="low">You come across</p>
    <p class="name">{{ name }}</p>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-flow: column;
}

.name {
  color: var(--color-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
