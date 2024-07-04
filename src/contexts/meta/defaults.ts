import { TriState, Display, Sort, ChapterSort, ChapterTitle, Mode, Layout } from '@/enums'

export const mangaMetaDefaults = {
  ChapterUnread: TriState.IGNORE,
  ChapterDownloaded: TriState.IGNORE,
  ChapterBookmarked: TriState.IGNORE,
  ChapterSort: ChapterSort.Source,
  ChapterAsc: false,
  ChapterFetchUpload: false,
  ChapterTitle: ChapterTitle.SourceTitle,
  Margins: false,
  Scale: false,
  Offset: false,
  // SmoothScroll: true,
  ReaderMode: Mode.Single,
  NavLayout: Layout.L,
  preLoadNextChapter: true,
  mobileFullScreenOnChapterPage: true,
  doPageIndicator: false,
}

export type MangaMeta = typeof mangaMetaDefaults

export const defaults = {
  nsfw: true,
  ignoreFiltersWhenSearching: false,
  Display: Display.Compact,
  Sort: Sort.ID,
  Asc: true,
  Unread: TriState.IGNORE,
  Downloaded: TriState.IGNORE,
  Tracked: TriState.IGNORE,
  Bookmarked: TriState.IGNORE,
  mangaMetaDefaults,
  /** Show or not downloads badge */
  downloadsBadge: true,
  /** Show or not unreads badge */
  unreadsBadge: true,
  mangaUpdatesTracking: {
    enabled: false,
    username: '',
    password: '',
    Authorization: '',
  },
  libraryCategoryTotalCounts: true,
  libraryResumeButton: false,
  resumeButton: false,
}

export type GlobalMeta = typeof defaults
