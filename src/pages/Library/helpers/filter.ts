import { GlobalMeta } from '@/contexts'
import { Mangas } from '..'
import { Sort } from '@/enums'

type TManga = NonNullable<Mangas>[number]

export function filterManga(item: TManga, globalMeta: GlobalMeta, query?: string) {
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

export function sortManga(a: TManga, b: TManga, globalMeta: GlobalMeta) {
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

type MangaChapterCount = { chapters: Pick<TManga['chapters'], 'totalCount'> }
type MangaUnread = Pick<TManga, 'unreadCount'> & MangaChapterCount
type MangaDownload = Pick<TManga, 'downloadCount'> & MangaChapterCount

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

function isNotDownloaded({ downloadCount }: MangaDownload) {
  return downloadCount === 0
}

function isFullyDownloaded({ downloadCount, chapters: { totalCount } }: MangaDownload) {
  return downloadCount === totalCount
}

function getFullyDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isFullyDownloaded)
}

function isPartiallyDownloaded(manga: MangaDownload) {
  return !isFullyDownloaded(manga) && !isNotDownloaded(manga)
}

function getPartiallyDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isPartiallyDownloaded)
}

function getNotDownloaded(mangas: NonNullable<Mangas>) {
  return mangas.filter(isNotDownloaded)
}

export function getDownloadable(mangas: NonNullable<Mangas>) {
  return [...getNotDownloaded(mangas), ...getPartiallyDownloaded(mangas)]
}

export function getDownloaded(mangas: NonNullable<Mangas>) {
  return [...getFullyDownloaded(mangas), ...getPartiallyDownloaded(mangas)]
}
