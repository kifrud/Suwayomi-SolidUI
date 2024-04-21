import { useAppContext, useGraphQLClient } from '@/contexts'
import { getCategories, getCategory } from '@/gql'
import {
  Component,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js'
import { CategoriesTabs, TitlesList } from './components'
import { useSearchParams } from '@solidjs/router'
import { Chip } from '@/components'

const Library: Component = () => {
  const ctx = useAppContext()
  const [searchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = createSignal(searchParams.tab ?? '1')
  const client = useGraphQLClient()
  const [categories] = createResource(async () => await client.query(getCategories, {}).toPromise())
  const orderedCategories = createMemo(() =>
    categories()
      ?.data?.categories.nodes.toSorted((a, b) => (a.order > b.order ? 1 : -1))
      .filter(e => e.mangas.totalCount)
  )

  const [category] = createResource(
    currentTab,
    async () => await client.query(getCategory, { id: Number(currentTab()) }).toPromise()
  )

  const mangas = createMemo(() =>
    category()?.data?.category.mangas.nodes.filter(item => {
      if (!item.inLibrary) return false
      return true
    })
  )

  const totalMangaCount = createMemo(
    () =>
      new Set(
        categories()?.data?.categories.nodes.flatMap(node =>
          node.mangas.nodes.map(manga => manga.id)
        )
      ).size
  )

  const totalMangaCountElement = <Chip>{totalMangaCount()}</Chip>

  createEffect(() => ctx.setHeaderData(totalMangaCountElement))
  onCleanup(() => ctx.setHeaderData(''))

  createEffect(() => console.log(Number(currentTab()), category))

  return (
    <div class="flex flex-col gap-2">
      <Show when={!categories.loading} fallback={<span>Fetching categories...</span>}>
        <CategoriesTabs
          categories={orderedCategories}
          value={currentTab}
          updateValue={setCurrentTab}
        />
      </Show>
      <Show when={!category.loading}>
        <TitlesList mangas={mangas} />
      </Show>
    </div>
  )
}

export default Library
