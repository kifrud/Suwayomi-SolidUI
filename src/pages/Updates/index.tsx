import { useGraphQLClient, useHeaderContext } from '@/contexts'
import { updates } from '@/gql/Queries'
import { createQuery } from '@tanstack/solid-query'
import { Component, createSignal, onCleanup, onMount } from 'solid-js'

const Updates: Component = () => {
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

  const [offset, setOffset] = createSignal(0)

  const update = createQuery(() => ({
    queryKey: ['updates', offset()],
    queryFn: async () => {
      return await client.query(updates, { offset: offset() }).toPromise()
    },
  }))

  onMount(() => {
    headerCtx.setHeaderEnd(null)
  })

  onCleanup(() => {
    headerCtx.clear()
  })

  return <div></div>
}

export default Updates
