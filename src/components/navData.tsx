import { JSXElement } from 'solid-js'
import { RoutePaths } from '@/enums'
import CollectionBookmarkOutline from '~icons/material-symbols/collections-bookmark-outline'
import CollectionBookmark from '~icons/material-symbols/collections-bookmark'
import AlertOutlined from '~icons/material-symbols/release-alert-outline'
import Alert from '~icons/material-symbols/release-alert'
import ExploreOutline from '~icons/material-symbols/explore-outline'
import Explore from '~icons/material-symbols/explore'
import DownloadOutline from '~icons/material-symbols/download-2-outline'
import Download from '~icons/material-symbols/download-2'
import Settings from '~icons/material-symbols/settings'
import SettingsOutline from '~icons/material-symbols/settings-outline'

export interface INavData {
  href: string
  name: 'library' | 'updates' | 'settings' | 'browse' | 'downloads'
  icon: {
    default: JSXElement
    active?: JSXElement // will use default if no active
  }
}

export const navData: () => INavData[] = () => [
  {
    href: RoutePaths.library,
    name: 'library',
    icon: {
      default: <CollectionBookmarkOutline />,
      active: <CollectionBookmark />,
    },
  },
  {
    href: RoutePaths.updates,
    name: 'updates',
    icon: {
      default: <AlertOutlined />,
      active: <Alert />,
    },
  },
  {
    href: RoutePaths.browse,
    name: 'browse',
    icon: {
      default: <ExploreOutline />,
      active: <Explore />,
    },
  },
  {
    href: RoutePaths.downloads,
    name: 'downloads',
    icon: {
      default: <DownloadOutline />,
      active: <Download />,
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
