import {
  Component,
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { Skeleton, UpdateCheck } from '@/components'
import { useAppContext, useGraphQLClient, useHeaderContext } from '@/contexts'
import { latestUpdateTimestamp, updates as updatesQuery } from '@/gql/Queries'
import { ResultOf } from '@/gql'
import { UpdatesList } from './components'
import './styles.scss'

export type UpdateNode = ResultOf<typeof updatesQuery>['chapters']['nodes'][number]

const groupByDate = (updates: UpdateNode[]): Record<string, UpdateNode[]> => {
  if (!updates.length) {
    return {}
  }

  const groupedUpdates: Record<string, UpdateNode[]> = {}

  updates.forEach(item => {
    const date = new Date(parseInt(item.fetchedAt) * 1000).toLocaleDateString()
    if (!groupedUpdates[date]) {
      groupedUpdates[date] = []
    }
    groupedUpdates[date].push(item)
  })

  return groupedUpdates
}

const Updates: Component = () => {
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const [updates, setUpdates] = createSignal<UpdateNode[]>([])
  const [offset, setOffset] = createSignal(0)

  const updatesData = createQuery(() => ({
    queryKey: ['updates', offset()],
    queryFn: async () => {
      const res = await client.query(updatesQuery, { offset: offset() }).toPromise()
      if (res && res.data && res.data.chapters.pageInfo.hasNextPage) {
        setUpdates(prev => [...prev, ...res.data!.chapters.nodes])
      }
      return res
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }))

  const [latestTimestampData] = createResource(
    async () =>
      await client
        .query(latestUpdateTimestamp, {}, { requestPolicy: 'cache-and-network' })
        .toPromise()
  )

  const latestTimestamp = createMemo(() =>
    new Date(+latestTimestampData.latest?.data?.lastUpdateTimestamp.timestamp!).toLocaleString()
  )
  const groupedUpdates = createMemo(() => groupByDate(updates()))

  onMount(() => {
    headerCtx.setHeaderEnd(<UpdateCheck />)
  })

  onCleanup(() => {
    headerCtx.clear()
  })

  let endDiv!: HTMLDivElement

  createIntersectionObserver(
    () => [endDiv],
    entries => {
      if (entries[0].isIntersecting && updatesData.data?.data?.chapters.pageInfo.hasNextPage) {
        setOffset(updates().length)
      }
    }
  )

  const placeholder = (
    <For each={new Array(20)}>
      {() => (
        <div class="flex gap-1">
          <Skeleton class="h-10 w-10 rounded">
            <div class="h-10 w-10">
              <div class="rounded" />
            </div>
          </Skeleton>
          <Skeleton class="w-24 h-4">
            <span class="w-24 h-4"></span>
          </Skeleton>
        </div>
      )}
    </For>
  )

  return (
    <div class="pt-2 w-full">
      <span class="opacity-70">
        <i>{t('global.latestTimestamp', { date: latestTimestamp() })}</i>
      </span>
      <div class="flex flex-col gap-2">
        <UpdatesList updates={groupedUpdates()} />
        <Show when={updatesData.isLoading}>{placeholder}</Show>
      </div>
      <div ref={el => (endDiv = el)} class="flex justify-center items-center w-full">
        <Show when={!updatesData.isLoading}>
          <span class="opacity-50">End of updates.</span>
        </Show>
      </div>
    </div>
  )
}

export default Updates
