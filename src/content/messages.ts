import type { BattleOutcome } from '@/domain/battle'

type BattleMessages = Record<BattleOutcome | '_', { outcome: string; action: string }>

const pactlessBattleMessages = {
  victory: { outcome: 'Victory !', action: 'They were celebrated by the kingdom' },
  stalemate: { outcome: 'Their strength matches !', action: 'They fell in love...' },
  unfortunate: {
    outcome: 'They both fell in battle...',
    action: 'This pact gave their life for the kingdom',
  },
  _: { outcome: '???', action: '???' },
} satisfies BattleMessages

export const BATTLE_MESSAGES = {
  regular: {
    victory: { outcome: 'Victory !', action: 'They went home to rest' },
    stalemate: { outcome: 'Their strength matches !', action: 'They fell in love !!' },
    unfortunate: {
      outcome: 'Everyone met an unfortunate end ...',
      action: 'They were brave fighters',
    },
    _: { outcome: '???', action: '???' },
  },
  pactless: pactlessBattleMessages,
  pactlessWinner: {
    ...pactlessBattleMessages,
    victory: { outcome: 'The Pactless prevailed ...', action: 'No reward was claimed' },
  },
} satisfies Record<string, BattleMessages>

export const DAY_MESSAGES = {
  again: 'Some champions want to battle each other!',
  pactless: 'The chosen Queenpact is defending against a Pactless !',
  noQueenpact: 'No Queenpact could step up to the Pactless.',
} as const
