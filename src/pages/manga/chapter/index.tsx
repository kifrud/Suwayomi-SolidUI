import {
  Component,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js'
import { useLocation, useNavigate, useParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { createScheduled, debounce } from '@solid-primitives/scheduled'
import { useGlobalMeta, useGraphQLClient } from '@/contexts'
import { ResultOf, VariablesOf } from '@/gql'
import { getManga, getSingleChapter } from '@/gql/Queries'
import { fetchChapterPages, updateChapter as updateChapterMutation } from '@/gql/Mutations'
import { ChapterOffset, getNextChapter, useNotification } from '@/helpers'
import { Mode, RoutePaths } from '@/enums'
import { ReaderProps, TChapter } from '@/types'
import { PagedReader, TransitionScreen } from './components'

const Chapter: Component = () => {
  const client = useGraphQLClient()
  const params = useParams()
  const navigate = useNavigate()
  const { mangaMeta: getMangaMeta, globalMeta } = useGlobalMeta()

  const { mangaMeta, set: setMangaMeta } = getMangaMeta(Number(params.id))

  const [manga, setManga] = createSignal<ResultOf<typeof getManga>>()
  const chapter = createQuery(() => ({
    queryKey: ['chapter', params.chapterId],
    queryFn: async () =>
      await client.query(getSingleChapter, { id: Number(params.chapterId) }).toPromise(),
  }))
  const [pages, setPages] =
    createSignal<ResultOf<typeof fetchChapterPages>['fetchChapterPages']['pages']>()
  const [loading, setLoading] = createSignal(true)
  const [direction, setDirection] = createSignal<ChapterOffset>()
  const [followingChapter, setFollowingChapter] = createSignal<TChapter>()

  const { unsubscribe } = client
    .query(getManga, { id: Number(params.id) })
    .subscribe(res => setManga(res.data))

  const fetchPages = async () => {
    if (chapter.data?.data && !loading() && !chapter.data?.data?.chapter.isDownloaded) {
      try {
        const res = await client
          .mutation(fetchChapterPages, { chapterId: Number(params.chapterId) })
          .toPromise()
        setPages(res.data?.fetchChapterPages.pages)
        setLoading(false)
      } catch (err) {
        useNotification('error', { message: err })
      }
    } else {
      setLoading(false)
    }
  }

  createEffect(() => {
    if (chapter.data?.data?.chapter.id) fetchPages()
  })

  const [lastPageReadSet, setLastPageReadSet] = createSignal(false)
  const [currentPage, setCurrentPage] = createSignal(0)
  const isLastPage = createMemo(() => currentPage() === chapter.data?.data?.chapter.pageCount! - 1)

  const scheduled = createScheduled(fn => debounce(fn, isLastPage() ? 0 : 1000))
  const debouncedPage = createMemo(p => {
    const value = currentPage()
    return scheduled() ? value : p
  })

  const prevChapter = createMemo(() => {
    if (!chapter.data?.data || !chapter.data?.data?.chapter) return
    return getNextChapter(chapter.data?.data?.chapter!, manga()?.manga.chapters.nodes ?? [], {
      offset: ChapterOffset.PREV,
      skipDupe: mangaMeta.skipDuplicate,
      skipDupeChapter: chapter.data?.data?.chapter,
    })
  })

  const nextChapter = createMemo(() => {
    if (!chapter.data?.data || !chapter.data?.data?.chapter) return
    return getNextChapter(chapter.data?.data?.chapter!, manga()?.manga.chapters.nodes ?? [], {
      skipDupe: mangaMeta.skipDuplicate,
      skipDupeChapter: chapter.data?.data?.chapter!,
    })
  })

  const updateChapter = async (
    patch: Pick<VariablesOf<typeof updateChapterMutation>, 'isRead' | 'lastPageRead'>
  ) => {
    await client.mutation(updateChapterMutation, { ...patch, id: Number(params.chapterId) })
  }

  const openChapter = (offset: ChapterOffset) => {
    const chapterToOpen = offset === ChapterOffset.NEXT ? nextChapter() : prevChapter()

    setLoading(true)
    if (!chapterToOpen) {
      useNotification('error', { message: 'no chapter' })
    }

    setCurrentPage(offset === ChapterOffset.NEXT ? 0 : chapterToOpen?.pageCount! - 1)
    setDirection(offset)
    setFollowingChapter(chapterToOpen)

    setLoading(false)

    navigate(`${RoutePaths.manga}/${manga()?.manga.id}${RoutePaths.chapter}/${chapterToOpen?.id}`, {
      replace: true,
    })
  }

  const loadNextChapter = () => {
    updateChapter({
      lastPageRead: chapter.data?.data?.chapter.pageCount! - 1,
      isRead: true,
    })

    openChapter(ChapterOffset.NEXT)
  }

  const loadPrevChapter = () => {
    openChapter(ChapterOffset.PREV)
  }

  createEffect(() => {
    if (loading() || !chapter.data?.data?.chapter) {
      return
    }

    setLastPageReadSet(true)

    if (chapter.data?.data?.chapter.pageCount! - 1 === chapter.data?.data?.chapter.lastPageRead) {
      setCurrentPage(0)
    } else setCurrentPage(chapter.data?.data?.chapter.lastPageRead!)
  })

  createEffect(() => {
    if (!chapter.data?.data?.chapter && !lastPageReadSet()) return

    const chapterUTD = client.readQuery(getSingleChapter, { id: Number(params.chapterId) })

    if (chapterUTD?.data?.chapter.lastPageRead === debouncedPage()!) return

    if (!(debouncedPage() !== -1 || debouncedPage() === chapter.data?.data?.chapter.pageCount! - 1))
      return

    updateChapter({
      lastPageRead:
        debouncedPage() !== -1 && debouncedPage() !== false ? (debouncedPage() as number) : 0,
      isRead: debouncedPage() === chapter.data?.data?.chapter.pageCount! - 1 ? true : undefined,
    })
  })

  onCleanup(() => {
    unsubscribe()
  })

  const readerProps = createMemo<ReaderProps>(() => ({
    chapter: chapter.data?.data?.chapter!,
    manga: manga()!,
    pages: pages() ?? [],
    updateCurrentPage: setCurrentPage,
    currentPage,
    settings: mangaMeta,
    nextChapter: loadNextChapter,
    prevChapter: loadPrevChapter,
  }))

  return (
    <>
      <Show
        when={direction()}
        fallback={
          <Switch>
            <Match
              when={
                mangaMeta.ReaderMode === Mode.SingleLTR || mangaMeta.ReaderMode === Mode.SingleRTL
              }
            >
              <PagedReader {...readerProps()} />
            </Match>
          </Switch>
        }
      >
        <TransitionScreen
          chapter={untrack(() => chapter.data?.data?.chapter!)}
          followingChapter={followingChapter()}
          direction={direction()}
          updateDirection={setDirection}
        />
      </Show>
    </>
  )
}

export default Chapter
