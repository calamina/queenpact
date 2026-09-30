<script setup lang="ts">
import { addPactToDay, DayPhase, DayType, type Day } from '@/domain/day'
import type { Pact } from '@/domain/pact'
import DayHeader from './DayHeader.vue'
import CreateCard from './CreateCard.vue'
import WinnerCard from './WinnerCard.vue'
import BattleStarter from './BattleStarter.vue'
import BattleScreen from './BattleScreen.vue'
import BattleResult from './BattleResult.vue'
import DayNext from './DayNext.vue'

const { day } = defineProps<{ day: Day }>()

function addPact(pactId: number, pact: Pact) {
  addPactToDay(day, pact, pactId)
}
</script>

<template>
  <TransitionGroup name="day" tag="div" class="day" appear>
    <DayHeader :day="day" />

    <div class="creation" v-if="day.type === DayType.CLASSIC">
      <CreateCard :id="1" @pact-created="addPact" />
      <CreateCard :id="2" @pact-created="addPact" />
    </div>
    <div class="creation" v-if="day.type === DayType.WINNERSHIP">
      <WinnerCard :pact="day.pacts[0]" />
      <WinnerCard :pact="day.pacts[1]" />
    </div>

    <BattleStarter v-if="day.phase >= DayPhase.READY" :day="day" />
    <BattleScreen v-if="day.phase >= DayPhase.FIGHTING" :day="day" />
    <BattleResult
      v-if="day.phase === DayPhase.END && day.battle"
      :outcome="day.battle.outcome"
      :rewards="day.battle.rewards"
      :winner="day.battle.winner"
    />
    <DayNext v-if="day.phase === DayPhase.END && day.battle" />
  </TransitionGroup>
</template>

<style scoped>
.creation {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}

.day {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100svh;
  padding: 1rem;
  gap: 1ch;
  overflow-y: auto;
  border-radius: 8px;
  scrollbar-color: #00000020 transparent;
  box-sizing: border-box;
  position: relative;
}

.day-move,
.day-enter-active,
.day-leave-active {
  transition: all 0.125s ease;
}

.day-enter-from {
  opacity: 0.3;
  transform: translateY(0.5rem);
}
.day-leave-to {
  opacity: 0.3;
  transform: translateY(-0.5rem);
}

.list-leave-active {
  position: absolute;
}
</style>
