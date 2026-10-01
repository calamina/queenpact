import { MAX_JOURNAL_ENTRIES } from '@/utils/constants'

const journalEntryType = ['VICTORY', 'STALEMATE', 'UNFORTUNATE'] as const
export type JournalEntryType = (typeof journalEntryType)[number]

export type JournalEntry = {
  message: string
  dayId?: number
  type?: JournalEntryType
}

export function createJournal(): JournalEntry[] {
  return []
}

export function addJournalEntry(journal: JournalEntry[], entry: JournalEntry) {
  const { dayId, type, message } = entry
  console.debug(dayId, type, message)

  if (journal.length >= MAX_JOURNAL_ENTRIES) journal.shift()
  journal.push(entry)
}
