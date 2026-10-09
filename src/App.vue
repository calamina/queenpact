<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'
import LayoutSidebar from './components/layouts/LayoutSidebar.vue'
import ModeButtons from './components/ModeButtons.vue'
import DayCard from './components/DayCard.vue'
import WinnerList from './components/WinnerList.vue'
import JournalEntries from './components/JournalEntries.vue'
import CalendarEntries from './components/CalendarEntries.vue'

const store = useGameStore()
onMounted(() => store.startNewDay())
</script>

<template>
  <main>
    <!-- <LayoutSidebar class="left">
      <CalendarEntries />
      <JournalEntries />
    </LayoutSidebar> -->

    <DayCard
      v-if="store.activeDay"
      :key="store.activeDay.id"
      :day="store.activeDay"
      class="center"
    />

    <!-- <LayoutSidebar class="right">
      <WinnerList />
      <ModeButtons />
    </LayoutSidebar> -->
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  /* height: 100svh; */
  width: 100vw;
  padding: 4rem 0;

  /* @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  } */
}
/*
.left {
  grid-column: 1;
  @media screen and (max-width: 900px) {
    display: none;
  }
}

.right {
  grid-column: 3;
  @media screen and (max-width: 900px) {
    display: none;
  }
}*/
.center {
  grid-column: 2;
  @media screen and (max-width: 900px) {
    grid-column: 1;
  }
}
</style>
