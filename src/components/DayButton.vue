<script setup lang="ts">
import { onMounted } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { autofight, label, pactless } = defineProps<{
  autofight: boolean
  label: string
  pactless?: boolean
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
    <button @click="emit('start')" :class="pactless ? 'pactless' : 'bg-main'">{{ label }}</button>
  </LayoutBlock>
</template>

<style scoped>
.pactless {
  background-color: var(--bg-pactless);
}

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
