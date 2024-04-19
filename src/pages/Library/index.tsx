import { useGraphQLClient } from '@/contexts'
import { getCategories } from '@/gql'
import { Component, createEffect, createResource, createSignal, onMount } from 'solid-js'

const Library: Component<{}> = props => {
  // const [categories, setCategories] = createSignal()
  const client = useGraphQLClient()

  // const [categories] = createResource(async () => client.query(getCategories, {}).toPromise())
  // createEffect(() => console.log(categories))
  createEffect(() => {
    console.log('called')
    console.log(client)

    client
      .query(getCategories, {})
      .toPromise()
      .then(res => console.log(res))
  })

  return <div></div>
}

export default Library
