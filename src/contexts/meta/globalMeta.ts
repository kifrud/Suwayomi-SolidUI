import { TriState, display, sort } from '@/enums'

export const defaults = {
  nsfw: true,
  ignoreFiltersWhenSearching: false,
  Display: display.Compact,
  Sort: sort.ID,
  Asc: true,
  Unread: TriState.IGNORE,
  Downloaded: TriState.IGNORE,
  Tracked: TriState.IGNORE,
  // mangaMetaDefaults,
  downloadsBadge: true,
  unreadBadge: true,
  mangaUpdatesTracking: {
    enabled: false,
    username: '',
    password: '',
    Authorization: '',
  },
  libraryCategoryTotalCounts: false,
}

export type GlobalMeta = typeof defaults
