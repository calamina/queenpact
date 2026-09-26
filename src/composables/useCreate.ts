import { ref, computed } from 'vue'
import { useStore } from '@/composables/useStore'
import { sleep } from '@/utils/utils'
import type { Stats } from '@/entities/Stats'
import type { Item } from '@/entities/Item'
import type { Pact } from '@/entities/Pact'

type CreateState = 'IDLE' | 'ID' | 'STATS' | 'ITEM' | 'DONE'

export function useCreatePact(pactId: number) {
  const store = useStore()

  const createState = ref<CreateState>('IDLE')
  const draftPact = ref<Partial<Pact>>({})

  const isIdDone = computed(() => ['STATS', 'ITEM', 'DONE'].includes(createState.value))
  const isStatsDone = computed(() => ['ITEM', 'DONE'].includes(createState.value))

  const time = computed(() =>
    store.blitz ? { id: 0, stats: 0, item: 0 } : { id: 700, stats: 250, item: 500 },
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

  const onItemCreated = async (item: Item) => {
    draftPact.value.items = [item]
    createState.value = 'DONE'

    await sleep(time.value.item)
    store.activeDay?.addPact(draftPact.value as Pact, pactId)
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
