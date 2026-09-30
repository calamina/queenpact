<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { HISTORY } from '@/utils/constants'
import gsap from 'gsap'
import { watch } from 'vue'

const store = useGameStore()

watch(
  () => store.activeDay,
  () => {
    const container = document.querySelector('.days') as HTMLElement
    gsap.to(container, {
      scrollTo: 'max',
      duration: 0.4,
      delay: 0.1,
      ease: 'sine.out',
    })
  },
)
</script>

<template>
  <div class="days">
    <a
      v-for="day in store.days.slice(-HISTORY.MAX_VISIBLE_DAYS)"
      class="day"
      :href="'#day' + day?.id"
      :class="{ 'day-high': day?.tier, 'day-low': day?.id !== store.activeDay?.id }"
    >
      Day {{ day?.id }} <span class="star" v-for="_ in day?.tier">✦</span>
    </a>
  </div>
</template>

<style scoped>
.days {
  display: flex;
  flex-flow: column;
  gap: 0.25rem;
  overflow: scroll;
  overscroll-behavior: contain;
  width: 100%;
  padding: 1rem;
  padding-top: 0;
}

.day {
  display: flex;
  gap: 1ch;
  text-decoration: none;
  text-underline-offset: 4px;

  &.day-low {
    color: #00000060;
  }

  &.day-high {
    color: slateblue;
  }

  &:hover,
  &:focus-within,
  &:last-child {
    &::before {
      content: '→';
    }
  }
}

.star {
  display: inline-block;
  width: 0ch;
}
</style>
