import { Component, For, Show, createSignal, onCleanup, onMount } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { Image, Skeleton, UpdateCheck } from '@/components'
import { useGraphQLClient, useHeaderContext } from '@/contexts'
import { updates as updatesQuery } from '@/gql/Queries'
import { ResultOf } from '@/gql'
import { A } from '@solidjs/router'

const Updates: Component = () => {
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

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
      <div class="flex flex-col gap-2">
        <Show when={!updatesData.isLoading} fallback={placeholder}>
          <For each={updates()}>
            {item => (
              <A href={`/manga/${item.manga.id}/chapter/${item.sourceOrder}`} class="flex gap-1">
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
