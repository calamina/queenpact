<script setup lang="ts">
import { computed, watch } from 'vue'
import { DayKind, DayPhase, isDayComplete, type Day } from '@/domain/day'
import { useGameStore } from '@/stores/game'
import { useScroll } from '@/composables/useScroll.ts'
import DayHeader from './DayHeader.vue'
import CreateCard from './CreateCard.vue'
import PactCard from './PactCard.vue'
import BattleScreen from './BattleScreen.vue'
import BattleResult from './BattleResult.vue'
import DayNext from './DayNext.vue'
import DayNotice from './DayNotice.vue'
import ReforgeScreen from './ReforgeScreen.vue'
import DayButton from './DayButton.vue'
import { beforeLeaveFlex } from '@/utils/utils.ts'

const { day } = defineProps<{ day: Day }>()
const store = useGameStore()
const { scrollToBottom } = useScroll()
const beforeLeave = computed(() => (store.blitz ? () => null : beforeLeaveFlex))
const regularDay = computed(() => day.kind === DayKind.REGULAR)
const pactlessDay = computed(() => day.kind === DayKind.PACTLESS)

watch(
  () => day.phase,
  () => {
    if (!store.blitz) scrollToBottom()
  },
  { flush: 'post' },
)
</script>

<template>
  <TransitionGroup
    name="day"
    tag="div"
    class="day"
    :appear="!store.blitz"
    @before-leave="beforeLeave"
  >
    <DayHeader :day="day" key="header" />
    <DayNotice :day="day" key="notice" />

    <div class="pacts" v-if="regularDay" key="creation">
      <CreateCard @pact-created="store.addPactToDay(day, $event, 1)" />
      <CreateCard @pact-created="store.addPactToDay(day, $event, 2)" />
    </div>
    <div class="pacts" v-else key="winners">
      <PactCard :pact="day.pacts[0]" />
      <PactCard :pact="day.pacts[1]" />
    </div>

    <DayButton
      v-if="day.phase === DayPhase.READY"
      key="starter"
      label="Fight"
      @start="store.startDayBattle(day)"
      :autofight="store.autofight"
      :pactless="pactlessDay"
    />
    <BattleScreen
      v-else-if="day.battle"
      key="screen"
      :day="day"
      :blitz="store.blitz"
      @finished="store.finishDayBattle(day)"
    />

    <BattleResult
      v-if="day.battle && day.phase !== DayPhase.FIGHTING"
      key="result"
      :outcome="day.battle.outcome"
      :rewards="day.battle.rewards"
      :winner="day.battle.winner"
      :pactless="pactlessDay"
    />

    <DayButton
      v-if="day.phase === DayPhase.DUPLICATE"
      :autofight="false"
      label="Reforge"
      @start="store.startDayReforge(day)"
      :pactless="pactlessDay"
    />
    <ReforgeScreen
      v-else-if="day.reforge"
      key="reforge"
      :current="day.reforge.current"
      :reward="day.reforge.reward"
      :result="day.reforgeResult"
      :autofight="store.autofight"
      :blitz="store.blitz"
      @reforge="store.resolveReforge(day)"
    />

    <DayNext
      v-if="isDayComplete(day)"
      key="next"
      :autofight="store.autofight"
      :blitz="store.blitz"
      @next="store.startNewDay()"
    />
  </TransitionGroup>
</template>

<style scoped>
.day {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  gap: 1ch;
  gap: 5ch;
  border-radius: 8px;
  scrollbar-color: #00000020 transparent;
  box-sizing: border-box;
  position: relative;
}

.pacts {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}

.battle-stage {
  display: flex;
  width: 100%;
  justify-content: center;
}

.day-enter-active,
.day-leave-active,
.day-move {
  transition:
    opacity 0.125s ease,
    transform 0.125s ease;
}
.day-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}
.day-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.day-leave-active {
  position: absolute;
}
</style>
