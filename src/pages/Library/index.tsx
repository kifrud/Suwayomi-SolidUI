import {
  Component,
  For,
  JSX,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { useSearchParams } from '@solidjs/router'
import { useGlobalMeta, useGraphQLClient, useHeaderContext } from '@/contexts'
import { getCategories, getCategory } from '@/gql/Queries'
import { Chip, SearchBar, Skeleton } from '@/components'
import { filterManga, matches, sortManga } from '@/helpers'
import { Mangas } from '@/types'
import {
  CategoriesTabs,
  LibraryActions,
  LibraryFilter,
  SelectionActions,
  TitlesList,
  Transition,
} from './components'
import CloseIcon from '~icons/material-symbols/close-rounded'
import './styles.scss'
import { createQuery } from '@tanstack/solid-query'

const Library: Component = () => {
  const { globalMeta } = useGlobalMeta()
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

  const [categories] = createResource(async () => await client.query(getCategories, {}).toPromise())

  const [searchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = createSignal(searchParams.tab ?? '1')
  // TODO: context?
  const [selected, setSelected] = createStore<NonNullable<Mangas>>([])

  const [selectMode, setSelectMode] = createSignal(false)
  const [showFilters, setShowFilters] = createSignal(false)

  const category = createQuery(() => ({
    queryKey: ['category', currentTab()],
    queryFn: async () =>
      await client
        .query(getCategory, { id: Number(currentTab()) }, { requestPolicy: 'cache-and-network' })
        .toPromise(),
  }))

  const orderedCategories = createMemo(() =>
    categories()
      ?.data?.categories.nodes.toSorted((a, b) => (a.order > b.order ? 1 : -1))
      .filter(e => e.mangas.totalCount)
  )

  const mangas = createMemo(() =>
    category.data?.data?.category.mangas.nodes
      .filter(item => filterManga(item, globalMeta, searchParams.q))
      .toSorted((a, b) => sortManga(a, b, globalMeta))
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

  const searchEl = (
    <Show when={matches.md}>
      <SearchBar />
    </Show>
  )

  const actionsEl = (
    <LibraryActions
      selectMode={selectMode}
      updateSelectMode={setSelectMode}
      selected={selected}
      updateSelected={setSelected}
      updateShowFilter={setShowFilters}
      mangas={mangas()}
    />
  )

  const selectionTitle = (
    <>
      <button
        class="icon-24 transition-all library-action"
        on:click={() => {
          setSelectMode(false)
          setSelected([])
        }}
      >
        <CloseIcon />
      </button>
      <span>{selected.length}</span>
    </>
  )

  onMount(() => {
    headerCtx.setHeaderCenter(searchEl)
    headerCtx.setHeaderEnd(actionsEl)
  })

  createEffect(() => {
    if (selected.length === 0) setSelectMode(false)
  })

  createEffect(() => {
    if (selectMode()) {
      headerCtx.setHeaderTitle(selectionTitle)
      headerCtx.setHeaderCenter(
        <SelectionActions
          selected={selected}
          updateSelected={setSelected}
          refetchCategory={category.refetch}
        />
      )
    } else {
      headerCtx.setHeaderTitle(null)
      headerCtx.setHeaderTitleData(totalMangaCountElement)
      headerCtx.setHeaderCenter(searchEl)
    }
  })

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

  const handleWrapperClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = e => {
    e.stopPropagation()
    e.preventDefault()
    if (!showFilters()) return

    setShowFilters(false)
  }

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
        <div
          class="transition-all"
          classList={{ 'h-full library--darker': showFilters() }}
          onClick={handleWrapperClick}
        >
          <TitlesList
            selectMode={selectMode}
            updateSelectMode={setSelectMode}
            selected={selected}
            updateSelected={setSelected}
            mangas={mangas}
            state={{
              isLoading: category.isLoading,
              isRefetching: category.isRefetching,
            }}
          />
        </div>
      </div>
      <Suspense>
        <Transition>
          <Show when={showFilters()}>
            <LibraryFilter />
          </Show>
        </Transition>
      </Suspense>
    </>
  )
}

export default Library
