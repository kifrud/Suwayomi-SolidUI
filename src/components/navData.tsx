import { JSXElement } from 'solid-js'
import { RoutePaths } from '@/enums'
import CollectionBookmarkOutline from '~icons/material-symbols/collections-bookmark-outline'
import CollectionBookmark from '~icons/material-symbols/collections-bookmark'
import Settings from '~icons/material-symbols/settings'
import SettingsOutline from '~icons/material-symbols/settings-outline'

export interface INavData {
  href: string
  name: 'library' | 'settings'
  icon: {
    default: JSXElement
    active?: JSXElement // will use default if no active
  }
}

export const navData: () => INavData[] = () => {
  return [
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
}
