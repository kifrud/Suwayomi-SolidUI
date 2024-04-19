import { RoutePaths } from '@/enums'
import CollectionBookmarkOutline from '~icons/material-symbols/collections-bookmark-outline'
import CollectionBookmark from '~icons/material-symbols/collections-bookmark'

export const navData = [
  {
    href: RoutePaths.library,
    name: 'library',
    icon: {
      default: <CollectionBookmarkOutline />,
      active: <CollectionBookmark />,
    },
  },
]
