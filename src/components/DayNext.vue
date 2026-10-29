<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { sleep } from '@/utils/utils.ts'

const props = defineProps<{
  autofight: boolean
  blitz: boolean
}>()

const emit = defineEmits<{
  next: []
}>()

const nexted = ref(false)

const handleNext = async () => {
  nexted.value = true
  if (!props.blitz) await sleep(500)
  emit('next')
}

const button = useTemplateRef<HTMLButtonElement>('button')

onMounted(() => {
  if (props.autofight) handleNext()
  button.value?.focus()
})
</script>

<template>
  <LayoutBlock class="next">
    <button ref="button" v-if="!nexted" @click="handleNext" class="bg-main">
      Start the next day
    </button>
    <p v-else class="ended">The day has ended ...</p>
  </LayoutBlock>
</template>

<style scoped>
.next {
  display: grid;
  width: 24rem;
  place-items: center;
}

.finished {
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
}

.ended {
  background-color: #0000000a;
}

button,
p {
  padding: 1rem;
  width: 100%;
}

p {
  text-align: center;
}

button {
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
