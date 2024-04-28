import { Component, For, Show, createMemo } from 'solid-js'
import { navData } from '../navData'
import NavbarItem from './NavbarItem'
import { useGlobalMeta } from '@/contexts'
import { Badge } from '../ui'
import './styles.scss'
import { matches } from '@/helpers'

const AppNavbar: Component = () => {
  const { globalMeta } = useGlobalMeta()
  const navbarType = createMemo(() => (matches.md ? 'desktop' : 'mobile'))

  return (
    <div class={`navbar navbar--${navbarType()}`}>
      <For each={navData()}>
        {item => (
          <Show
            when={
              item.name === 'updates' &&
              typeof globalMeta.downloadsBadge === 'number' &&
              globalMeta.downloadsBadge > 0
            }
            fallback={<NavbarItem data={item} />}
          >
            <Badge count={Number(globalMeta.downloadsBadge)}>
              <NavbarItem data={item} />
            </Badge>
          </Show>
        )}
      </For>
    </div>
  )
}

export default AppNavbar
