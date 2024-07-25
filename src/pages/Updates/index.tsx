import { Component, For, Show, createMemo, createResource, onCleanup, onMount } from 'solid-js'
import { createInfiniteQuery } from '@tanstack/solid-query'
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

  const updatesData = createInfiniteQuery(() => ({
    queryKey: ['updates'],
    queryFn: async ({ pageParam }) => {
      const res = await client.query(updatesQuery, { offset: pageParam }).toPromise()
      return res
    },
    getNextPageParam: lastPage => {
      if (lastPage.data?.chapters.pageInfo.hasNextPage) {
        return lastPage.data.chapters.nodes.length
      }
    },
    initialPageParam: 0,
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
  const groupedUpdates = createMemo(
    () =>
      updatesData.data &&
      groupByDate(
        updatesData.data.pages.map(item => item.data!.chapters.nodes).flatMap(item => item)
      )
  )

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
      if (entries[0].isIntersecting && updatesData.hasNextPage) {
        updatesData.fetchNextPage()
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
        <Show when={groupedUpdates()}>
          <UpdatesList updates={groupedUpdates()!} refetchUpdates={updatesData.refetch} />
        </Show>
        <Show when={updatesData.isLoading || updatesData.isFetchingNextPage}>{placeholder}</Show>
      </div>
      <div ref={el => (endDiv = el)} class="flex justify-center items-center w-full">
        <Show when={!updatesData.isLoading}>
          <span class="opacity-50">{t('exceptions.updates.end')}</span>
        </Show>
      </div>
    </div>
  )
}

export default Updates
