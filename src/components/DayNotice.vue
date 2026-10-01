<script setup lang="ts">
import type { Day } from '@/domain/day.ts'
import LayoutBlock from './layouts/LayoutBlock.vue'
import { ref, computed } from 'vue'
import { MESSAGE_BATTLE_AGAIN } from '@/utils/constants.ts'

const { day } = defineProps<{ day: Day }>()

// in case there are other conditions later
const showNotice = computed(() => day.tier)
const messages = ref([MESSAGE_BATTLE_AGAIN])
</script>

<template>
  <LayoutBlock v-if="showNotice" class="notice">
    <p class="low" v-for="message in messages" :key="message">
      {{ message }}
    </p>
  </LayoutBlock>
</template>

<style scoped>
.notice {
  padding: 1rem;
}

p {
  text-align: center;
}
</style>
