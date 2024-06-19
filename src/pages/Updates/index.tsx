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
import { A } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { Image, Skeleton, UpdateCheck } from '@/components'
import { useAppContext, useGraphQLClient, useHeaderContext } from '@/contexts'
import { latestUpdateTimestamp, updates as updatesQuery } from '@/gql/Queries'
import { ResultOf } from '@/gql'
import './styles.scss'

const groupByDate = (
  updates: ResultOf<typeof updatesQuery>['chapters']['nodes']
): Record<string, ResultOf<typeof updatesQuery>['chapters']['nodes']> => {
  if (!updates.length) {
    return {}
  }

  const groupedUpdates: Record<string, ResultOf<typeof updatesQuery>['chapters']['nodes']> = {}

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

  const [updates, setUpdates] = createSignal<ResultOf<typeof updatesQuery>['chapters']['nodes']>([])
  const [offset, setOffset] = createSignal(0)

  const updatesData = createQuery(() => ({
    queryKey: ['updates', offset()],
    queryFn: async () => {
      const res = await client.query(updatesQuery, { offset: offset() }).toPromise()
      if (res && res.data) {
        setUpdates(prev => [...prev, ...res.data!.chapters.nodes])
      }
      return res
    },
  }))

  const [latestTimestampData, { refetch }] = createResource(
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
        <Show when={!updatesData.isLoading} fallback={placeholder}>
          <For each={Object.entries(groupedUpdates())}>
            {([date, items]) => (
              <>
                <span class="updates__group-date">{date}</span>
                <For each={items}>
                  {item => (
                    <div class="flex gap-1">
                      <A
                        href={`/manga/${item.manga.id}/chapter/${item.sourceOrder}`}
                        class="flex gap-1 w-full"
                      >
                        <div class="h-10 w-10">
                          <Image
                            class="rounded object-cover min-h-10 min-w-10"
                            rounded="none"
                            src={item.manga.thumbnailUrl!}
                            alt=" "
                          />
                        </div>
                        <div class="flex flex-col justify-between text-ellipsis overflow-hidden">
                          <span>{item.manga.title}</span>
                          <span>{item.name}</span>
                        </div>
                      </A>
                      {/* <div class="flex gap-1">
                  <button></button>
                </div> */}
                    </div>
                  )}
                </For>
              </>
            )}
          </For>
        </Show>
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
