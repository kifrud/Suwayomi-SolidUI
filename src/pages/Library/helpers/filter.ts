import { GlobalMeta } from '@/contexts'
import { Mangas } from '..'
import { Sort } from '@/enums'

type SingleManga = NonNullable<Mangas>[number]

export function filterManga(item: SingleManga, globalMeta: GlobalMeta, query?: string) {
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

export function sortManga(a: SingleManga, b: SingleManga, globalMeta: GlobalMeta) {
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
