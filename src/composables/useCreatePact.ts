import { ref, computed } from 'vue'
import { sleep } from '@/utils/utils'
import { createPact, type Pact } from '@/domain/pact'
import type { Stats, StatsSource } from '@/domain/stats'
import type { Item } from '@/domain/item'

type CreateState = 'IDLE' | 'ID' | 'STATS' | 'ITEM' | 'DONE'
type PactDraft = { id?: string; name?: string; stats?: StatsSource }

export function useCreatePact(isBlitz: () => boolean) {
  const createState = ref<CreateState>('IDLE')
  const draftPact = ref<PactDraft>({})

  const isIdDone = computed(() => ['STATS', 'ITEM', 'DONE'].includes(createState.value))
  const isStatsDone = computed(() => ['ITEM', 'DONE'].includes(createState.value))

  const time = computed(() =>
    isBlitz() ? { id: 0, stats: 0, item: 0 } : { id: 700, stats: 250, item: 500 },
  )

  const onIdentityCreated = async (id: string, name: string) => {
    draftPact.value = { id, name }
    createState.value = 'ID'

    await sleep(time.value.id)
    createState.value = 'STATS'
  }

  const onStatsCreated = async (stats: Stats) => {
    draftPact.value.stats = stats

    await sleep(time.value.stats)
    createState.value = 'ITEM'
  }

  const onItemCreated = async (item: Item): Promise<Pact | null> => {
    createState.value = 'DONE'

    await sleep(time.value.item)

    const { id, name, stats } = draftPact.value
    if (id === undefined || name === undefined || !stats) return null

    return createPact({ id, name, stats, items: [item] })
  }

  return {
    createState,
    draftPact,
    isIdDone,
    isStatsDone,
    onIdentityCreated,
    onStatsCreated,
    onItemCreated,
  }
}
