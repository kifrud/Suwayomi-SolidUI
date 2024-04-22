import { Component, For, Show } from 'solid-js'
import { navData } from '../navData'
import NavbarItem from './NavbarItem'
import { useAppContext } from '@/contexts'
import { Badge } from '../ui'
import './styles.scss'

const AppNavbar: Component = () => {
  const { globalMeta } = useAppContext()

  return (
    <div class="navbar">
      <For each={navData()}>
        {item => (
          <Show when={item.name === 'updates' && globalMeta.updatesCount > 0} fallback={<NavbarItem data={item} />}>
            <Badge count={globalMeta.updatesCount}>
              <NavbarItem data={item} />
            </Badge>
          </Show>
        )}
      </For>
    </div>
  )
}

export default AppNavbar
