import { useGraphQLClient, useHeaderContext } from '@/contexts'
import { getCategories, getCategory } from '@/gql'
import {
  Component,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { CategoriesTabs, TitlesList } from './components'
import { useSearchParams } from '@solidjs/router'
import { Chip, Input } from '@/components'
import SearchIcon from '~icons/material-symbols/search'
import { matches } from '@/helpers'

const Library: Component = () => {
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = createSignal(searchParams.tab ?? '1')
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
      if (
        searchParams.query !== '' &&
        searchParams.query !== null &&
        searchParams.query !== undefined &&
        item.title.toLowerCase().includes(searchParams.query.toLowerCase())
      )
        return true

      if (
        searchParams.query !== '' &&
        searchParams.query !== null &&
        searchParams.query !== undefined &&
        !item.title.toLowerCase().includes(searchParams.query.toLowerCase())
      )
        return false
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

  const [searchValue, setSearchValue] = createSignal('')

  const mobileSearch = (
    <div>
      <span>
        <SearchIcon />
      </span>
    </div>
  )

  const searchInput = (
    <Input
      type="search"
      placeholder="Search"
      class="w-full"
      wrapperClass="lg:w-[512px] md:w-96 w-full"
      value={searchValue}
      onchange={e => setSearchValue(e.currentTarget.value)}
      icon={<SearchIcon />}
      onSubmit={() => setSearchParams({ q: searchValue() })}
    />
  )

  createEffect(() => console.log(searchValue()))

  onMount(() => {
    // could've wrapped it inside createEffect or use Show tag in each element but nah
    headerCtx.setHeaderCenter(matches.md && searchInput)
    headerCtx.setHeaderEnd(!matches.md && mobileSearch)
  })

  createEffect(() => headerCtx.setHeaderTitleData(totalMangaCountElement))
  onCleanup(() => headerCtx.clear())

  return (
    <div class="flex flex-col gap-2">
      <Show when={!categories.loading} fallback={<span>Fetching categories...</span>}>
        {' '}
        {/* TODO: TRANSLATE */}
        <Show
          when={categories.latest?.data || categories.error}
          fallback={<span class="text-rose-800">An error occurred when fetching categories</span>}
        >
          <CategoriesTabs
            categories={orderedCategories}
            value={currentTab}
            updateValue={setCurrentTab}
          />
        </Show>
      </Show>
      <Show when={!category.loading}>
        <TitlesList mangas={mangas} />
      </Show>
    </div>
  )
}

export default Library
