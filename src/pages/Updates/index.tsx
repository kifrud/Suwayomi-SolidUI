import { Component, For, createSignal, onCleanup, onMount } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { Image, Skeleton, UpdateCheck } from '@/components'
import { useGraphQLClient, useHeaderContext } from '@/contexts'
import { updates as updatesQuery } from '@/gql/Queries'
import { ResultOf } from '@/gql'

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

  const placeholder = <Skeleton></Skeleton>

  return (
    <div>
      <div class="flex flex-col gap-2">
        <For each={updates()}>
          {item => (
            <div class="flex gap-1">
              <div class="h-10 w-10">
                <Image class="rounded" rounded="none" src={item.manga.thumbnailUrl!} alt=" " />
              </div>
              <span>{item.name}</span>
            </div>
          )}
        </For>
      </div>
      {updatesData.isLoading && <div>Loading...</div>}
      <div ref={el => (endDiv = el)} class="flex justify-center items-center w-full">
        <span class="opacity-50">End of updates.</span>
      </div>
    </div>
  )
}

export default Updates
