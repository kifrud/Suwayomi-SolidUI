import { GlobalMeta, MangaMeta } from '@/contexts'
import { ChapterSort, Sort } from '@/enums'
import { UpdateNode } from '@/pages/Updates'
import { Mangas, TChapter, TLibraryManga } from '@/types'

export function filterManga(item: TLibraryManga, globalMeta: GlobalMeta, query?: string) {
  if (!item.inLibrary) return false
  if (globalMeta.ignoreFiltersWhenSearching) {
    if (
      query !== '' &&
      query !== null &&
      query !== undefined &&
      item.title.toLowerCase().includes(query.toLowerCase())
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
    query !== '' &&
    query !== null &&
    query !== undefined &&
    !item.title.toLowerCase().includes(query.toLowerCase())
  )
    return false
  return true
}

export function sortManga(a: TLibraryManga, b: TLibraryManga, globalMeta: GlobalMeta) {
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
}

export function filterChapters(chapter: TChapter, mangaMeta: MangaMeta) {
  if (mangaMeta.ChapterUnread === 1 && chapter.isRead) return false
  if (mangaMeta.ChapterUnread === 2 && !chapter.isRead) return false

  if (mangaMeta.ChapterDownloaded === 1 && !chapter.isDownloaded) return false
  if (mangaMeta.ChapterDownloaded === 2 && chapter.isDownloaded) return false

  if (mangaMeta.ChapterBookmarked === 1 && !chapter.isBookmarked) return false
  if (mangaMeta.ChapterBookmarked === 2 && chapter.isBookmarked) return false
  return true
}

export function sortChapters(a: TChapter, b: TChapter, mangaMeta: MangaMeta) {
  let tmp = true
  if (mangaMeta.ChapterSort === ChapterSort.Source) {
    tmp = a.sourceOrder > b.sourceOrder
  } else if (mangaMeta.ChapterSort === ChapterSort.FetchedDate) {
    tmp = a.fetchedAt > b.fetchedAt
  } else {
    tmp = a.uploadDate > b.uploadDate
  }
  if (mangaMeta.ChapterAsc) tmp = !tmp
  return tmp ? -1 : 1
}

type MangaChapterCount = { chapters: Pick<TLibraryManga['chapters'], 'totalCount'> }
type MangaUnread = Pick<TLibraryManga, 'unreadCount'> & MangaChapterCount
type MangaDownload = Pick<TLibraryManga, 'downloadCount'> & MangaChapterCount

function isFullyReadManga({ unreadCount }: MangaUnread) {
  return unreadCount === 0
}

function getFullyReadManga(mangas: NonNullable<Mangas>) {
  return mangas.filter(isFullyReadManga)
}

function isMangaUnread({ unreadCount, chapters: { totalCount } }: MangaUnread) {
  return unreadCount === totalCount
}

function getUnreadManga(mangas: NonNullable<Mangas>) {
  return mangas?.filter(isMangaUnread)
}

function isPartiallyReadManga(manga: MangaUnread) {
  return !isFullyReadManga(manga) && !isMangaUnread(manga)
}

function getPartiallyReadManga(mangas: NonNullable<Mangas>) {
  return mangas?.filter(isPartiallyReadManga)
}

export function getUnreadMangas(mangas: NonNullable<Mangas>) {
  return [...getUnreadManga(mangas), ...getPartiallyReadManga(mangas)]
}

export function getReadMangas(mangas: NonNullable<Mangas>) {
  return [...getFullyReadManga(mangas), ...getPartiallyReadManga(mangas)]
}

function isFullyDownloadedManga({ downloadCount, chapters: { totalCount } }: MangaDownload) {
  return downloadCount === totalCount
}

function getFullyDownloadedManga(mangas: NonNullable<Mangas>) {
  return mangas.filter(isFullyDownloadedManga)
}

function isNotDownloaded({ downloadCount }: MangaDownload) {
  return downloadCount === 0
}

function getNotDownloadedManga(mangas: NonNullable<Mangas>) {
  return mangas.filter(isNotDownloaded)
}

function isPartiallyDownloaded(manga: MangaDownload) {
  return !isFullyDownloadedManga(manga) && !isNotDownloaded(manga)
}

function getPartiallyDownloadedManga(mangas: NonNullable<Mangas>) {
  return mangas.filter(isPartiallyDownloaded)
}

export function getDownloadableManga(mangas: NonNullable<Mangas>) {
  return [...getNotDownloadedManga(mangas), ...getPartiallyDownloadedManga(mangas)]
}

export function getDownloadedManga(mangas: NonNullable<Mangas>) {
  return [...getFullyDownloadedManga(mangas), ...getPartiallyDownloadedManga(mangas)]
}

type Chapters = (UpdateNode | TChapter)[]

export function getDownloadableChapter(chapters: Chapters) {
  return chapters.filter(chapter => !chapter.isDownloaded)
}

export function getDownloadedChapter(chapters: Chapters) {
  return chapters.filter(chapter => chapter.isDownloaded)
}

export function getUnBookmarkedChapter(chapters: Chapters) {
  return chapters.filter(chapter => !chapter.isBookmarked)
}

export function getBookmarkedChapter(chapters: Chapters) {
  return chapters.filter(chapter => chapter.isBookmarked)
}

export function getUnReadChapter(chapters: Chapters) {
  return chapters.filter(chapter => !chapter.isRead)
}

export function getReadChapter(chapters: Chapters) {
  return chapters.filter(chapter => chapter.isRead)
}

export enum ChapterOffset {
  NEXT = 1,
  PREV = -1,
}

export function removeDuplicates<T extends TChapter>(currentChapter: T, chapters: T[]): T[] {
  const chapterNumberToChapters = Object.groupBy(chapters, ({ chapterNumber }) => chapterNumber)

  const uniqueChapters = Object.values(chapterNumberToChapters).map(
    groupedChapters =>
      groupedChapters!.find(chapter => chapter.id === currentChapter.id) ??
      groupedChapters!.findLast(chapter => chapter.scanlator === currentChapter.scanlator) ??
      groupedChapters!.slice(-1)[0]
  )

  return chapters
    .map(({ id }) => uniqueChapters.find(chapter => chapter.id === id))
    .filter((chapter): chapter is T => !!chapter)
}

export function getNextChapter<C extends TChapter>(
  currentChapter: C,
  chapters: C[],
  {
    offset = ChapterOffset.NEXT,
    ...options
  }: {
    offset?: ChapterOffset
    onlyUnread?: boolean
    skipDupe?: boolean
    skipDupeChapter?: TChapter
  } = {}
): TChapter | undefined {
  const nextChapters = getNextChapters(currentChapter, chapters, { offset, ...options })

  const isNextChapterOffset = offset === ChapterOffset.NEXT
  const sliceStartIndex = isNextChapterOffset ? -1 : 0
  const sliceEndIndex = isNextChapterOffset ? undefined : 1

  return nextChapters.slice(sliceStartIndex, sliceEndIndex)[0]
}

export function getNextChapters<C extends TChapter>(
  fromChapter: C,
  chapters: C[],
  {
    offset = ChapterOffset.NEXT,
    skipDupe = false,
    skipDupeChapter = fromChapter,
  }: {
    offset?: ChapterOffset
    skipDupe?: boolean
    skipDupeChapter?: TChapter
  } = {}
): C[] {
  const fromChapterIndex = chapters.findIndex(chapter => chapter.id === fromChapter.id)

  const isNextChapterOffset = offset === ChapterOffset.NEXT
  const sliceStartIndex = isNextChapterOffset ? 0 : fromChapterIndex
  const sliceEndIndex = isNextChapterOffset ? fromChapterIndex + 1 : undefined

  const nextChaptersIncludingCurrent = chapters.slice(sliceStartIndex, sliceEndIndex)
  const uniqueNextChapters = skipDupe
    ? removeDuplicates(skipDupeChapter, nextChaptersIncludingCurrent)
    : nextChaptersIncludingCurrent
  const nextChapters = uniqueNextChapters.toSpliced(isNextChapterOffset ? -1 : 0, 1)

  return nextChapters as C[]
}
