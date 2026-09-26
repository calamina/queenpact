<script setup lang="ts">
import LayoutBlock from './layouts/LayoutBlock.vue'
import CreatePact from './CreatePact.vue'
import CreateName from './CreateName.vue'
import CreateStatList from './CreateStatList.vue'
import CreateItem from './CreateItem.vue'
import { useCreatePact } from '@/composables/useCreatePact.ts'

const { id } = defineProps<{
  id: number
}>()

const {
  createState,
  draftPact,
  isIdDone,
  isStatsDone,
  onIdentityCreated,
  onStatsCreated,
  onItemCreated,
} = useCreatePact(id)
</script>

<template>
  <LayoutBlock class="create">
    <CreatePact v-if="createState === 'IDLE'" @id="onIdentityCreated" />
    <div v-else-if="draftPact.name" class="pact">
      <CreateName :name="draftPact.name" />
      <CreateStatList v-if="isIdDone" @stats="onStatsCreated" />
      <CreateItem v-if="isStatsDone" @item="onItemCreated" />
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
