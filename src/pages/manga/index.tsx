import { Component } from 'solid-js'
import { useGraphQLClient } from '@/contexts'
import { getManga } from '@/gql/Queries'
import { useParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'

const Manga: Component = () => {
  const client = useGraphQLClient()
  const params = useParams()

  const mangaData = createQuery(() => ({
    queryKey: ['manga'],
    queryFn: async () => {
      await client.query(getManga, { id: Number(params.id) })
    },
  }))

  return <div></div>
}

export default Manga
