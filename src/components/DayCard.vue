<script setup lang="ts">
import { computed } from 'vue'
import { DayPhase, type Day } from '@/domain/day'
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

const showPactCreation = computed(() => !day.tier)
const showBattleStarter = computed(() => day.phase === DayPhase.READY)
const showBattleScreen = computed(() => day.battle !== null)
const battleResult = computed(() => {
  const isResultPhase =
    day.phase === DayPhase.RESULT || day.phase === DayPhase.REFORGE || day.phase === DayPhase.END
  return isResultPhase ? day.battle : null
})
const visibleReforge = computed(() => {
  const shouldShow =
    day.phase === DayPhase.REFORGE || day.phase === DayPhase.END || day.reforgeResult !== null
  return shouldShow ? day.reforge : null
})
const showDayNext = computed(() => day.phase === DayPhase.END && day.battle !== null)
</script>

<template>
  <TransitionGroup name="day" tag="div" class="day" appear>
    <DayHeader :day="day" key="header" />
    <DayNotice :day="day" key="notice" />

    <div class="pacts" v-if="showPactCreation" key="creation">
      <CreateCard @pact-created="store.addPactToDay(day, $event, 1)" />
      <CreateCard @pact-created="store.addPactToDay(day, $event, 2)" />
    </div>
    <div class="pacts" v-else key="winners">
      <WinnerCard :pact="day.pacts[0]" />
      <WinnerCard :pact="day.pacts[1]" />
    </div>

    <div class="battle-stage" key="battle">
      <Transition name="day">
        <BattleStarter
          v-if="showBattleStarter"
          key="starter"
          :autofight="store.autofight"
          @start="store.startDayBattle(day)"
        />
        <BattleScreen
          v-else-if="showBattleScreen"
          key="screen"
          :day="day"
          :blitz="store.blitz"
          @finished="store.finishDayBattle(day)"
        />
      </Transition>
    </div>
    <BattleResult
      v-if="battleResult"
      key="result"
      :outcome="battleResult.outcome"
      :rewards="battleResult.rewards"
      :winner="battleResult.winner"
    />
    <ItemReforge
      v-if="visibleReforge"
      key="reforge"
      :current="visibleReforge.current"
      :reward="visibleReforge.reward"
      :result="day.reforgeResult"
      @reforge="store.resolveReforge()"
    />
    <DayNext
      v-if="showDayNext"
      key="next"
      :autofight="store.autofight"
      :blitz="store.blitz"
      @next="store.startNewDay()"
    />
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
