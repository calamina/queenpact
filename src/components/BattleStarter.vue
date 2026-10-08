<script setup lang="ts">
import { onMounted } from 'vue'
import LayoutBlock from './layouts/LayoutBlock.vue'

const props = defineProps<{
  autofight: boolean
}>()

const emit = defineEmits<{
  start: []
}>()

onMounted(() => {
  if (props.autofight) emit('start')
})
</script>

<template>
  <LayoutBlock class="fight">
    <div class="box">
      <button @click="emit('start')" class="bg-main">Fight</button>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.fight {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.box {
  width: 100%;
}

button,
p {
  position: relative;
  padding: 1rem;
  width: 100%;
  text-align: center;
}
</style>
