<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'
import LayoutSidebar from './components/layouts/LayoutSidebar.vue'
import ModeButtons from './components/ModeButtons.vue'
import DayIndex from './components/DayIndex.vue'
import DayList from './components/DayList.vue'
import WinnerList from './components/WinnerList.vue'

const store = useGameStore()
onMounted(() => store.startNewDay())
</script>

<template>
  <main>
    <LayoutSidebar>
      <ModeButtons />
      <DayIndex />
    </LayoutSidebar>

    <DayList />

    <LayoutSidebar>
      <WinnerList />
    </LayoutSidebar>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  height: 100svh;
  width: 100vw;

  @media screen and (max-width: 900px) {
    grid-template-columns: 0 1fr 0;
  }
}
</style>
