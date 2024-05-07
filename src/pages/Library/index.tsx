import { useGlobalMeta, useGraphQLClient, useHeaderContext } from '@/contexts'
import { getCategories, getCategory } from '@/gql/Queries'
import {
  Component,
  For,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { CategoriesTabs, LibraryActions, LibraryFilter, TitlesList } from './components'
import { useSearchParams } from '@solidjs/router'
import { Chip, Input, SearchBar, Skeleton } from '@/components'
import { matches } from '@/helpers'
import SearchIcon from '~icons/material-symbols/search'

const Library: Component = () => {
  const { globalMeta } = useGlobalMeta()
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
        searchParams.q !== '' &&
        searchParams.q !== null &&
        searchParams.q !== undefined &&
        item.title.toLowerCase().includes(searchParams.q.toLowerCase())
      )
        return true

      if (
        searchParams.q !== '' &&
        searchParams.q !== null &&
        searchParams.q !== undefined &&
        !item.title.toLowerCase().includes(searchParams.q.toLowerCase())
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

  const totalMangaCountElement = (
    <Chip radius="xl" class="py-1 px-2">
      {totalMangaCount()}
    </Chip>
  )

  const [searchValue, setSearchValue] = createSignal(searchParams.q ?? '')

  const handleSubmit = () => setSearchParams({ q: searchValue() })

  const searchInput = (
    <Show when={matches.md}>
      <Input
        type="search"
        placeholder="Search"
        class="w-full"
        wrapperClass="lg:w-[512px] md:w-96 w-full"
        value={searchValue}
        onInput={e => setSearchValue(e.currentTarget.value)} // since onKeyDown don't receive e.currentTarget from onChange
        icon={<SearchIcon />}
        onSubmit={handleSubmit}
      />
    </Show>
  )

  const [showFilters, setShowFilters] = createSignal(false)

  onMount(() => {
    headerCtx.setHeaderCenter(
      <Show when={matches.md}>
        <SearchBar />
      </Show>
    )
    headerCtx.setHeaderEnd(<LibraryActions updateShowFilter={setShowFilters} />)
  })

  createEffect(() =>
    headerCtx.setHeaderTitleData(globalMeta.libraryCategoryTotalCounts && totalMangaCountElement)
  )
  onCleanup(() => headerCtx.clear())

  const tabsPlaceholder = (
    <div class="flex gap-2 items-center h-[40px] fixed w-full py-2">
      <For each={new Array(5)}>
        {() => (
          <Skeleton rounded="lg" class="flex items-center gap-1 px-4 py-2 pb-2 h-[32px] w-[75px]" />
        )}
      </For>
    </div>
  )

  return (
    <>
      <div class="flex flex-col gap-2 w-full">
        <Show when={!categories.loading} fallback={tabsPlaceholder}>
          {/* TODO: TRANSLATE */}
          <Show
            when={categories.latest?.data}
            fallback={<span class="text-rose-800">An error occurred when fetching categories</span>}
          >
            <CategoriesTabs
              categories={orderedCategories}
              value={currentTab}
              updateValue={setCurrentTab}
            />
          </Show>
        </Show>
        <TitlesList mangas={mangas} isLoading={category.loading} />
      </div>
      <Show when={showFilters()}>
        <LibraryFilter />
      </Show>
    </>
  )
}

export default Library
