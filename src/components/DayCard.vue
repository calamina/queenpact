<script setup lang="ts">
import { addPactToDay, DayPhase, type Day } from '@/domain/day'
import type { Pact } from '@/domain/pact'
import { useGameStore } from '@/stores/game'
import DayHeader from './DayHeader.vue'
import CreateCard from './CreateCard.vue'
import WinnerCard from './WinnerCard.vue'
import BattleStarter from './BattleStarter.vue'
import BattleScreen from './BattleScreen.vue'
import BattleResult from './BattleResult.vue'
import DayNext from './DayNext.vue'
import DayNotice from './DayNotice.vue'
import ItemReforge from './ItemReforge.vue'

const { day } = defineProps<{ day: Day }>()
const store = useGameStore()

function addPact(pactId: number, pact: Pact) {
  addPactToDay(day, pact, pactId)
}
</script>

<template>
  <TransitionGroup name="day" tag="div" class="day" appear>
    <DayHeader :day="day" key="header" />
    <DayNotice :day="day" key="notice" />

    <div class="pacts" v-if="!day.tier" key="creation">
      <CreateCard :id="1" @pact-created="addPact" />
      <CreateCard :id="2" @pact-created="addPact" />
    </div>
    <div class="pacts" v-else key="winners">
      <WinnerCard :pact="day.pacts[0]" />
      <WinnerCard :pact="day.pacts[1]" />
    </div>

    <div class="battle-stage" key="battle">
      <Transition name="day" mode="out-in">
        <BattleStarter v-if="day.phase === DayPhase.READY" key="starter" :day="day" />
        <BattleScreen v-else-if="day.phase >= DayPhase.FIGHTING" key="screen" :day="day" />
      </Transition>
    </div>
    <BattleResult
      v-if="day.phase >= DayPhase.RESULT && day.battle"
      key="result"
      :outcome="day.battle.outcome"
      :rewards="day.battle.rewards"
      :winner="day.battle.winner"
    />
    <ItemReforge
      v-if="day.reforge && (day.phase >= DayPhase.REFORGE || day.reforgeResult)"
      key="reforge"
      :current="day.reforge.current"
      :reward="day.reforge.reward"
      :result="day.reforgeResult"
      @reforge="store.resolveReforge"
    />
    <DayNext v-if="day.phase === DayPhase.END && day.battle" key="next" />
  </TransitionGroup>
</template>

<style scoped>
.pacts {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}

.battle-stage {
  width: 100%;
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

.day-enter-active {
  transition:
    opacity 0.125s ease,
    transform 0.125s ease;
}
.day-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}

.day-leave-active {
  position: absolute;
}
</style>
