import {
  Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { useSearchParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
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

const Library: Component = () => {
  const { globalMeta } = useGlobalMeta()
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

  const categories = createQuery(() => ({
    queryKey: ['categories'],
    queryFn: async () =>
      await client.query(getCategories, {}, { requestPolicy: 'cache-and-network' }).toPromise(),
  }))

  const [searchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = createSignal(searchParams.tab ?? '1')

  const [selected, setSelected] = createStore<NonNullable<Mangas>>([])

  const [selectMode, setSelectMode] = createSignal(false)
  const [showFilters, setShowFilters] = createSignal(false)

  const category = createQuery(() => ({
    queryKey: ['category', currentTab(), categories.data?.data],
    queryFn: async () =>
      await client
        .query(getCategory, { id: Number(currentTab()) }, { requestPolicy: 'cache-and-network' })
        .toPromise(),
  }))

  const orderedCategories = createMemo(() =>
    categories.data?.data?.categories.nodes
      .toSorted((a, b) => (a.order > b.order ? 1 : -1))
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
        categories.data?.data?.categories.nodes.flatMap(node =>
          node.mangas.nodes.map(manga => manga.id)
        )
      ).size
  )

  const totalMangaCountEl = (
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

  const selectionActionsEl = (
    <SelectionActions
      selected={selected}
      updateSelected={setSelected}
      refetchCategory={category.refetch}
      refetchCategories={categories.refetch}
    />
  )

  const selectionTitle = (
    <>
      <button
        class="icon-24 transition-all action"
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
      headerCtx.setHeaderCenter(selectionActionsEl)
    } else {
      headerCtx.setHeaderTitle(null)
      headerCtx.setHeaderTitleData(totalMangaCountEl)
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
  // TODO: wrap in <ErrorBoundary>
  return (
    <>
      <div class="flex flex-col gap-2 w-full">
        <Show when={!categories.isLoading} fallback={tabsPlaceholder}>
          {/* TODO: TRANSLATE */}
          <Show
            when={categories.data}
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
      <Transition>
        <Show when={showFilters()}>
          <LibraryFilter />
        </Show>
      </Transition>
    </>
  )
}

export default Library
