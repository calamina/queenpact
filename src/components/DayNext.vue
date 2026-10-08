<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

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
  if (!props.blitz) await new Promise((resolve) => setTimeout(resolve, 500))
  emit('next')
}

onMounted(() => {
  if (props.autofight) handleNext()
})
</script>

<template>
  <LayoutBlock class="next">
    <button v-if="!nexted" @click="handleNext" class="bg-main">Start the next day</button>
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
</style>
