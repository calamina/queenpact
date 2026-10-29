<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { sleep } from '@/utils/utils.ts'

const {
  autofight,
  label,
  pactless,
  alt,
  swap,
  blitz = undefined,
} = defineProps<{
  autofight: boolean
  label: string
  blitz?: boolean
  alt?: string
  pactless?: boolean
  swap?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const clicked = ref(false)
const showAlt = computed(() => swap && clicked.value)

const handleNext = async () => {
  clicked.value = true
  console.debug(blitz)
  if (!blitz && blitz !== undefined) await sleep(500)
  emit('click')
}

onMounted(() => {
  if (autofight) handleNext()
})
</script>

<template>
  <LayoutBlock class="button-wrapper">
    <button v-if="!showAlt" @click="handleNext()" :class="pactless ? 'pactless' : 'bg-main'">
      {{ label }}
    </button>
    <p v-else class="alt">{{ alt }}</p>
  </LayoutBlock>
</template>

<style scoped>
.pactless {
  background-color: var(--bg-pactless);
  color: oklch(40% 0.12 330 / 0.8);
  &:focus-visible,
  &:hover {
    text-decoration-color: oklch(60% 0.1 330 / 0.4);
    &::before,
    &::after {
      color: oklch(50% 0.09 330 / 0.4);
    }
  }
}

.button-wrapper {
  width: fit-content;
}

button {
  position: relative;
  padding: 1rem;
  width: 24rem;
  text-align: center;
  color: oklch(40% 0.12 170 / 0.8);

  &:focus-visible,
  &:hover {
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

  &:focus-visible {
    outline-offset: 1ch;
    outline: 1ch solid #0000000a;
  }
}

.alt {
  background-color: #0000000a;
  padding: 1rem 2rem;
  width: 100%;
  text-align: center;
}
</style>
