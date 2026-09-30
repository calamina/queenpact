<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'
import LayoutSidebar from './components/layouts/LayoutSidebar.vue'
import ModeButtons from './components/ModeButtons.vue'
import DayCard from './components/DayCard.vue'
import WinnerList from './components/WinnerList.vue'

const store = useGameStore()
onMounted(() => store.startNewDay())
</script>

<template>
  <main>
    <LayoutSidebar />

    <Transition mode="out-in">
      <DayCard v-if="store.activeDay" :key="store.activeDay.id" :day="store.activeDay" />
    </Transition>

    <LayoutSidebar>
      <WinnerList />
      <ModeButtons />
    </LayoutSidebar>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  /* grid-template-columns: 75% 25%; */
  height: 100svh;
  width: 100vw;

  @media screen and (max-width: 900px) {
    grid-template-columns: 0 1fr 0;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
