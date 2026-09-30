<script setup lang="ts">
import LayoutBlock from './layouts/LayoutBlock.vue'
import CreatePact from './CreatePact.vue'
import CreateName from './CreateName.vue'
import CreateStatList from './CreateStatList.vue'
import CreateItem from './CreateItem.vue'
import { useCreatePact } from '@/composables/useCreatePact.ts'
import { useGameStore } from '@/stores/game'
import type { Item } from '@/domain/item'
import type { Pact } from '@/domain/pact'

const { id } = defineProps<{
  id: number
}>()

const emit = defineEmits<{
  (e: 'pact-created', pactId: number, pact: Pact): void
}>()

const store = useGameStore()

const {
  createState,
  draftPact,
  isIdDone,
  isStatsDone,
  onIdentityCreated,
  onStatsCreated,
  onItemCreated,
} = useCreatePact(() => store.blitz)

async function handleItemCreated(item: Item) {
  const pact = await onItemCreated(item)
  if (pact) emit('pact-created', id, pact)
}
</script>

<template>
  <LayoutBlock class="create">
    <CreatePact v-if="createState === 'IDLE'" @id="onIdentityCreated" />
    <div v-else-if="draftPact.name" class="pact">
      <CreateName :name="draftPact.name" />
      <CreateStatList v-if="isIdDone" @stats="onStatsCreated" />
      <CreateItem v-if="isStatsDone" @item="handleItemCreated" />
    </div>
  </LayoutBlock>
</template>

<style scoped>
.create {
  width: 100%;
  position: relative;
  height: fit-content;
  height: 22.4rem;
}

.pact {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
  min-height: 4rem;
}

.pact > * {
  transform: translateY(0);
  opacity: 1;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  @starting-style {
    opacity: 0;
    transform: translateY(0.4rem);
  }
}
</style>
