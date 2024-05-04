import { TriState, Display, Sort } from '@/enums'

export const defaults = {
  nsfw: true,
  ignoreFiltersWhenSearching: false,
  Display: Display.Compact,
  Sort: Sort.ID,
  Asc: true,
  Unread: TriState.IGNORE,
  Downloaded: TriState.IGNORE,
  Tracked: TriState.IGNORE,
  // mangaMetaDefaults,
  /** Show or not downloads badge */
  downloadsBadge: true,
  /** Show or not unreads badge */
  unreadBadge: true,
  mangaUpdatesTracking: {
    enabled: false,
    username: '',
    password: '',
    Authorization: '',
  },
  libraryCategoryTotalCounts: true,
}

export type GlobalMeta = typeof defaults
