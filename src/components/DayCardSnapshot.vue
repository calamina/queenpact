<script setup lang="ts">
import { DayType, type DaySnapshot } from '@/domain/day'
import BattleScreenSnapshot from './BattleScreenSnapshot.vue'
import BattleResult from './BattleResult.vue'
import BattleStarter from './BattleStarter.vue'
import DayNext from './DayNext.vue'
import WinnerCard from './WinnerCard.vue'
import OriginalFighterCard from './OriginalFighterCard.vue'

defineProps<{
  day: DaySnapshot
  showNext: boolean
}>()
</script>

<template>
  <div class="creation">
    <template v-if="day.type === DayType.CLASSIC">
      <OriginalFighterCard v-for="pact in day.pacts" :key="pact.id" :pact="pact" />
    </template>
    <WinnerCard v-else v-for="pact in day.pacts" :key="pact.id" :pact="pact" />
  </div>
  <BattleStarter :day="day" />
  <BattleScreenSnapshot :p1="day.battle.p1" :p2="day.battle.p2" />
  <BattleResult
    :outcome="day.battle.outcome"
    :rewards="day.battle.rewards"
    :winner="day.battle.winner"
  />
  <DayNext v-if="showNext" :day="day" />
</template>

<style scoped>
.creation {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}
</style>
