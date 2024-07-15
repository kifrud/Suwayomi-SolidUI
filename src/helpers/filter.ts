import { GlobalMeta, MangaMeta } from '@/contexts'
import { ChapterSort, Sort } from '@/enums'
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

function isFullyRead({ unreadCount }: MangaUnread) {
  return unreadCount === 0
}

function getFullyRead(mangas: NonNullable<Mangas>) {
  return mangas.filter(isFullyRead)
}

function isMangaUnread({ unreadCount, chapters: { totalCount } }: MangaUnread) {
  return unreadCount === totalCount
}

function getUnread(mangas: NonNullable<Mangas>) {
  return mangas?.filter(isMangaUnread)
}

function isPartiallyRead(manga: MangaUnread) {
  return !isFullyRead(manga) && !isMangaUnread(manga)
}

function getPartiallyRead(mangas: NonNullable<Mangas>) {
  return mangas?.filter(isPartiallyRead)
}

export function getUnreadMangas(mangas: NonNullable<Mangas>) {
  return [...getUnread(mangas), ...getPartiallyRead(mangas)]
}

export function getReadMangas(mangas: NonNullable<Mangas>) {
  return [...getFullyRead(mangas), ...getPartiallyRead(mangas)]
}

function isFullyDownloaded({ downloadCount, chapters: { totalCount } }: MangaDownload) {
  return downloadCount === totalCount
}

function getFullyDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isFullyDownloaded)
}

function isNotDownloaded({ downloadCount }: MangaDownload) {
  return downloadCount === 0
}

function getNotDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isNotDownloaded)
}

function isPartiallyDownloaded(manga: MangaDownload) {
  return !isFullyDownloaded(manga) && !isNotDownloaded(manga)
}

function getPartiallyDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isPartiallyDownloaded)
}

export function getDownloadable(mangas: NonNullable<Mangas>) {
  return [...getNotDownloaded(mangas), ...getPartiallyDownloaded(mangas)]
}

export function getDownloaded(mangas: NonNullable<Mangas>) {
  return [...getFullyDownloaded(mangas), ...getPartiallyDownloaded(mangas)]
}
