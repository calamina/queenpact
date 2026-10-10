<script setup lang="ts">
import { onMounted } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { autofight, label } = defineProps<{
  autofight: boolean
  label: string
}>()

const emit = defineEmits<{
  start: []
}>()

onMounted(() => {
  if (autofight) emit('start')
})
</script>

<template>
  <LayoutBlock class="button-wrapper">
    <button @click="emit('start')" class="bg-main">{{ label }}</button>
  </LayoutBlock>
</template>

<style scoped>
.button-wrapper {
  width: fit-content;
}

button {
  position: relative;
  padding: 1rem;
  /* width: 100%; */
  width: 24rem;
  text-align: center;
}
</style>
