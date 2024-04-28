import { display, sort } from '@/enums'
import { TriState } from '@/types'

export const defaults = {
  nsfw: true,
  ignoreFiltersWhenSearching: false,
  Display: display.Compact,
  Sort: sort.ID,
  Asc: true,
  Unread: 0 as TriState,
  Downloaded: 0 as TriState,
  Tracked: 0 as TriState,
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
