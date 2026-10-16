import type { BattleOutcome } from '@/domain/battle'
import type { StatType } from '@/domain/stat'

export const FIGHT = {
  MAX_IDLE_ROUNDS: 3,
  MITIGATION_K: 120,
} as const

export const LEVELUP = {
  HP_VALUE: 5,
  DEFAULT_VALUE: 1,
} as const

export const DICES: Record<StatType, { dices: number; d: number }> = {
  HP: { dices: 4, d: 9 },
  ATK: { dices: 2, d: 6 },
  DEF: { dices: 2, d: 4 },
} as const

export const MAX_JOURNAL_ENTRIES = 4

export const TIERS = {
  1: 'Pacten',
  2: 'Qhand',
  3: 'Jjaar',
  4: 'Shand',
  5: 'Strahl',
  6: 'Abstrahl',
  7: 'Myrie',
  8: 'Anda-Myrie',
} as const
export type TierKey = keyof typeof TIERS

type BattleMessages = Record<BattleOutcome | '_', { outcome: string; action: string }>

const PACTLESS_BATTLE_MESSAGES = {
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
  pactless: PACTLESS_BATTLE_MESSAGES,
  pactlessWinner: {
    ...PACTLESS_BATTLE_MESSAGES,
    victory: { outcome: 'The Pactless prevailed ...', action: 'No reward was claimed' },
  },
} satisfies Record<string, BattleMessages>

export const MESSAGE_BATTLE_AGAIN = 'Some champions want to battle each other!'
export const MESSAGE_BATTLE_PACTLESS = 'The chosen Queenpact is defending against a Pactless !'
export const MESSAGE_BATTLE_NO_QUEENPACT = 'No Queenpact could step up to the Pactless.'

export const pactlessNames = [
  'King Bael',
  'Duke Agares',
  'Prince Vassago',
  'Marquis Samigina',
  'President Marbas',
  'Duke Valefor',
  'Marquis Amon',
  'Duke Barbatos',
  'King Paimon',
  'President Buer',
  'Duke Gusion',
  'Prince Sitri',
  'King Beleth',
  'Marquis Leraje',
  'Duke Eligos',
  'Duke Zepar',
  'President Botis',
  'Duke Bathin',
  'Duke Sallos',
  'King Purson',
  'President Marax',
  'Prince Ipos',
  'Duke Aim',
  'Marquis Naberius',
  'Earl Glasya-Labolas',
  'Duke Bune',
  'Marquis Ronove',
  'Duke Berith',
  'Duke Astaroth',
  'Marquis Forneus',
  'President Foras',
  'King Asmodeus',
  'Prince Gaap',
  'Earl Furfur',
  'Marquis Marchosias',
  'Prince Stolas',
  'Marquis Phenex',
  'Earl Halphas',
  'President Malphas',
  'Earl Raum',
  'Duke Focalor',
  'Duke Vepar',
  'Marquis Sabnock',
  'Marquis Shax',
  'King Vine',
  'Earl Bifrons',
  'Duke Uvall',
  'President Haagenti',
  'Duke Crocell',
  'Knight Furcas',
  'King Balam',
  'Duke Alloces',
  'President Camio',
  'Duke Murmur',
  'Prince Orobas',
  'Duke Gremory',
  'President Ose',
  'President Amy',
  'Marquis Orias',
  'Duke Vapula',
  'King Zagan',
  'President Volac',
  'Marquis Andras',
  'Duke Haures',
  'Marquis Andrealphus',
  'Marquis Cimejes',
  'Duke Amdusias',
  'King Belial',
  'Marquis Decarabia',
  'Prince Seere',
  'Duke Dantalion',
  'Earl Andromalius',
]
