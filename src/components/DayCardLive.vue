<script setup lang="ts">
import { DayPhase, DayType, type ActiveDay } from '@/domain/day'
import type { Pact } from '@/domain/pact'
import CreateCard from './CreateCard.vue'
import WinnerCard from './WinnerCard.vue'
import BattleStarter from './BattleStarter.vue'
import BattleScreen from './BattleScreen.vue'
import BattleResult from './BattleResult.vue'

defineProps<{ day: ActiveDay }>()

const emit = defineEmits<{
  (e: 'pact-created', pactId: number, pact: Pact): void
}>()
</script>

<template>
  <div class="creation" v-if="day.type === DayType.CLASSIC">
    <CreateCard :id="1" @pact-created="(pactId, pact) => emit('pact-created', pactId, pact)" />
    <CreateCard :id="2" @pact-created="(pactId, pact) => emit('pact-created', pactId, pact)" />
  </div>
  <div class="creation" v-if="day.type === DayType.WINNERSHIP">
    <WinnerCard :pact="day.pacts[0]" />
    <WinnerCard :pact="day.pacts[1]" />
  </div>

  <BattleStarter v-if="day.phase >= DayPhase.READY" :day="day" />
  <BattleScreen v-if="day.phase >= DayPhase.FIGHTING" :day="day" />
  <BattleResult
    v-if="day.phase >= DayPhase.RESULT && day.battle"
    :outcome="day.battle.outcome"
    :rewards="day.battle.rewards"
    :winner="day.battle.winner"
  />
</template>

<style scoped>
.creation {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}
</style>
