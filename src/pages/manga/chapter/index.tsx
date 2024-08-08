import { useNavigate, useParams } from '@solidjs/router'
import {
  Component,
  Match,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js'
import { useGlobalMeta, useGraphQLClient } from '@/contexts'
import { ResultOf, VariablesOf } from '@/gql'
import { getManga, getSingleChapter } from '@/gql/Queries'
import { fetchChapterPages, updateChapter as updateChapterMutation } from '@/gql/Mutations'
import { ChapterOffset, getNextChapter, useNotification } from '@/helpers'
import { createScheduled, debounce } from '@solid-primitives/scheduled'
import { Mode, RoutePaths } from '@/enums'
import { ReaderProps } from '@/types'
import { PagedReader } from './components'

const Chapter: Component = () => {
  const client = useGraphQLClient()
  const params = useParams()
  const navigate = useNavigate()
  const { mangaMeta: getMangaMeta, globalMeta } = useGlobalMeta()

  const { mangaMeta, set: setMangaMeta } = getMangaMeta(Number(params.id))

  const [manga, setManga] = createSignal<ResultOf<typeof getManga>>()
  const [chapter, setChapter] = createSignal<ResultOf<typeof getSingleChapter>>()
  const [pages, setPages] =
    createSignal<ResultOf<typeof fetchChapterPages>['fetchChapterPages']['pages']>()
  const [loading, setLoading] = createSignal(true)

  const { unsubscribe } = client
    .query(getManga, { id: Number(params.id) })
    .subscribe(res => setManga(res.data))

  const { unsubscribe: unsubscribeChapter } = client
    .query(getSingleChapter, {
      id: Number(params.chapterId),
    })
    .subscribe(res => setChapter(res.data))

  const fetchPages = async () => {
    if (chapter() && !loading() && !chapter()?.chapter.isDownloaded) {
      try {
        const res = await client
          .mutation(fetchChapterPages, { chapterId: Number(chapter()?.chapter.id!) })
          .toPromise()
        setPages(res.data?.fetchChapterPages.pages)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      setLoading(false)
    }
  }

  createEffect(() => {
    if (chapter()?.chapter.id) fetchPages()
  })

  const [lastPageReadSet, setLastPageReadSet] = createSignal(false)
  const [currentPage, setCurrentPage] = createSignal(0)
  const isLastPage = createMemo(() => currentPage() === chapter()?.chapter.pageCount! - 1)

  const scheduled = createScheduled(fn => debounce(fn, isLastPage() ? 0 : 1000))
  const debouncedPage = createMemo(p => {
    const value = currentPage()
    return scheduled() ? value : p
  })

  const prevChapter = createMemo(() => {
    if (!chapter() || !chapter()?.chapter) return
    return getNextChapter(chapter()?.chapter!, manga()?.manga.chapters.nodes ?? [], {
      offset: ChapterOffset.PREV,
      skipDupe: mangaMeta.skipDuplicate,
      skipDupeChapter: chapter()?.chapter,
    })
  })

  const nextChapter = createMemo(() => {
    if (!chapter() || !chapter()?.chapter) return
    return getNextChapter(chapter()?.chapter!, manga()?.manga.chapters.nodes ?? [], {
      skipDupe: mangaMeta.skipDuplicate,
      skipDupeChapter: chapter()?.chapter!,
    })
  })

  const updateChapter = async (
    patch: Pick<VariablesOf<typeof updateChapterMutation>, 'isRead' | 'lastPageRead'>
  ) => {
    await client.mutation(updateChapterMutation, { ...patch, id: Number(params.chapterId) })
  }

  const openChapter = (offset: ChapterOffset) => {
    const chapterToOpen = offset === ChapterOffset.NEXT ? nextChapter() : prevChapter()

    if (!chapterToOpen) {
      useNotification('error', { message: 'no chapter' })
    }

    setCurrentPage(offset === ChapterOffset.NEXT ? 0 : chapterToOpen?.pageCount! + 1)

    navigate(`${RoutePaths.manga}/${manga()?.manga.id}${RoutePaths.chapter}/${chapterToOpen?.id}`, {
      replace: true,
    })
  }

  const loadNextChapter = () => {
    updateChapter({
      lastPageRead: chapter()?.chapter.pageCount! - 1,
      isRead: true,
    })

    openChapter(ChapterOffset.NEXT)
  }

  const loadPrevChapter = () => {
    openChapter(ChapterOffset.PREV)
  }

  createEffect(() => {
    if (loading() || !chapter()?.chapter) {
      return
    }

    setLastPageReadSet(true)

    if (chapter()?.chapter.pageCount! - 1 === chapter()?.chapter.lastPageRead) {
      setCurrentPage(0)
    } else setCurrentPage(chapter()?.chapter.lastPageRead!)
  })

  createEffect(() => {
    if (!chapter()?.chapter && !lastPageReadSet()) return

    const chapterUTD = client.readQuery(getSingleChapter, { id: Number(params.chapterId) })

    if (chapterUTD?.data?.chapter.lastPageRead === debouncedPage()!) return

    if (!(debouncedPage() !== -1 || debouncedPage() === chapter()?.chapter.pageCount! - 1)) return

    updateChapter({
      lastPageRead:
        debouncedPage() !== -1 && debouncedPage() !== false ? (debouncedPage() as number) : 0,
      isRead: debouncedPage() === chapter()?.chapter.pageCount! - 1 ? true : undefined,
    })
  })

  onCleanup(() => {
    unsubscribe()
    unsubscribeChapter()
  })

  const readerProps: ReaderProps = {
    chapter: chapter()?.chapter!,
    manga: manga()!,
    pages: pages()!,
    updateCurrentPage: setCurrentPage,
    currentPage,
    settings: mangaMeta,
    nextChapter: loadNextChapter,
    prevChapter: loadPrevChapter,
  }

  return (
    <div>
      <Switch>
        <Match
          when={mangaMeta.ReaderMode === Mode.SingleLTR || mangaMeta.ReaderMode === Mode.SingleRTL}
        >
          <PagedReader {...readerProps} />
        </Match>
      </Switch>
    </div>
  )
}

export default Chapter
