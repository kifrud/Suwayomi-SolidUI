import { RoutePaths } from '@/enums'
import CollectionBookmarkOutline from '~icons/material-symbols/collections-bookmark-outline'
import CollectionBookmark from '~icons/material-symbols/collections-bookmark'
import Settings from '~icons/material-symbols/settings'
import SettingsOutline from '~icons/material-symbols/settings-outline'

export const navData = [
  {
    href: RoutePaths.library,
    name: 'library',
    icon: {
      default: <CollectionBookmarkOutline />,
      active: <CollectionBookmark />,
    },
  },
  {
    href: RoutePaths.settings,
    name: 'settings',
    icon: {
      default: <SettingsOutline />,
      active: <Settings />,
    },
  },
]
