<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { autofight, label, pactless } = defineProps<{
  autofight: boolean
  label: string
  pactless?: boolean
}>()

const emit = defineEmits<{
  start: []
}>()

const button = useTemplateRef<HTMLButtonElement>('button')

onMounted(() => {
  if (autofight) emit('start')
  button.value?.focus({ focusVisible: true })
})
</script>

<template>
  <LayoutBlock class="button-wrapper">
    <button ref="button" @click="emit('start')" :class="pactless ? 'pactless' : 'bg-main'">
      {{ label }}
    </button>
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
  color: oklch(40% 0.12 170 / 0.8);

  &:focus-visible,
  &:hover {
    outline-offset: 1ch;
    outline: 1ch solid #0000000a;
    text-decoration: wavy;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: oklch(60% 0.1 170 / 0.4);
    text-decoration-skip-ink: none;
    text-underline-offset: 3px;

    &::before {
      content: '✦\00a0';
      color: oklch(50% 0.09 170 / 0.4);
    }
    &::after {
      content: '\00a0✦';
      color: oklch(50% 0.09 170 / 0.4);
    }
  }
}
</style>
