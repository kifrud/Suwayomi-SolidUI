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
import { Chip, SearchBar, Skeleton } from '@/components'
import { matches } from '@/helpers'
import { Sort } from '@/enums'

const Library: Component = () => {
  const { globalMeta } = useGlobalMeta()
  const headerCtx = useHeaderContext()
  const client = useGraphQLClient()

  const [searchParams] = useSearchParams()
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
    category()
      ?.data?.category.mangas.nodes.filter(item => {
        if (!item.inLibrary) return false
        if (globalMeta.ignoreFiltersWhenSearching) {
          if (
            searchParams.q !== '' &&
            searchParams.q !== null &&
            searchParams.q !== undefined &&
            item.title.toLowerCase().includes(searchParams.q.toLowerCase())
          )
            return true
        }

        if (globalMeta.Downloaded === 1 && item.downloadCount === 0) return false
        if (globalMeta.Downloaded === 2 && item.downloadCount !== 0) return false

        if (globalMeta.Unread === 1 && item.unreadCount === 0) return false
        if (globalMeta.Unread === 2 && item.unreadCount !== 0) return false

        if (globalMeta.Bookmarked === 1 && item.bookmarkCount === 0) return false
        if (globalMeta.Bookmarked === 2 && item.bookmarkCount !== 0) return false

        if (
          searchParams.q !== '' &&
          searchParams.q !== null &&
          searchParams.q !== undefined &&
          !item.title.toLowerCase().includes(searchParams.q.toLowerCase())
        )
          return false
        return true
      })
      .toSorted((a, b) => {
        let result = true
        switch (globalMeta.Sort) {
          case Sort.ID:
            result = a.id > b.id
            break
          case Sort.Unread:
            result = a.unreadCount > b.unreadCount
            break
          case Sort.Alphabetical:
            result = a.title > b.title
            break
          case Sort.LatestRead:
            result =
              parseInt(a.lastReadChapter?.lastReadAt ?? '0') >
              parseInt(b.lastReadChapter?.lastReadAt ?? '0')
            break
          case Sort.LatestFetched:
            result =
              parseInt(a.latestFetchedChapter?.fetchedAt ?? '0') >
              parseInt(b.latestFetchedChapter?.fetchedAt ?? '0')
            break
          case Sort.LatestUploaded:
            result =
              parseInt(a.latestUploadedChapter?.uploadDate ?? '0') >
              parseInt(b.latestUploadedChapter?.uploadDate ?? '0')
        }
        if (globalMeta.Asc) result = !result

        return result ? -1 : 1
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
