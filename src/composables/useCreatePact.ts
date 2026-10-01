import { ref, computed } from 'vue'
import { sleep } from '@/utils/utils'
import { createPact, type Pact } from '@/domain/pact'
import type { Stats } from '@/domain/stats'
import type { Item } from '@/domain/item'

const CREATE_STATE = {
  IDLE: 0,
  ID: 1,
  STATS: 2,
  ITEM: 3,
  DONE: 4,
} as const
type CreateState = (typeof CREATE_STATE)[keyof typeof CREATE_STATE]

type PactDraft = Partial<Pick<Pact, 'id' | 'name' | 'stats'>>

export function useCreatePact(isBlitz: () => boolean) {
  const createState = ref<CreateState>(CREATE_STATE.IDLE)
  const draftPact = ref<PactDraft>({})

  const isIdle = computed(() => createState.value === CREATE_STATE.IDLE)
  const isIdDone = computed(() => createState.value >= CREATE_STATE.STATS)
  const isStatsDone = computed(() => createState.value >= CREATE_STATE.ITEM)

  const time = computed(() =>
    isBlitz() ? { id: 0, stats: 0, item: 0 } : { id: 700, stats: 250, item: 500 },
  )

  const onIdentityCreated = async (id: string, name: string) => {
    draftPact.value = { id, name }
    createState.value = CREATE_STATE.ID

    await sleep(time.value.id)
    createState.value = CREATE_STATE.STATS
  }

  const onStatsCreated = async (stats: Stats) => {
    draftPact.value.stats = stats

    await sleep(time.value.stats)
    createState.value = CREATE_STATE.ITEM
  }

  const onItemCreated = async (item: Item): Promise<Pact | null> => {
    createState.value = CREATE_STATE.DONE

    await sleep(time.value.item)

    const { id, name, stats } = draftPact.value
    if (id === undefined || name === undefined || !stats) return null

    return createPact({ id, name, stats, items: [item] })
  }

  return {
    draftPact,
    isIdle,
    isIdDone,
    isStatsDone,
    onIdentityCreated,
    onStatsCreated,
    onItemCreated,
  }
}
