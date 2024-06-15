import { Component, Show, createMemo, mergeProps } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { useAppContext } from '@/contexts'
import { INavData } from '../navData'

interface NavbarItemProps {
  data: INavData
}

const NavbarItem: Component<NavbarItemProps> = props => {
  const location = useLocation()
  const { t } = useAppContext()
  const data = mergeProps(props.data) // don't wanna access data props through props.data
  const isActive = createMemo(() => location.pathname.toLowerCase() === data.href)

  return (
    <A href={data.href} class="navbar-item" classList={{ active: isActive() }}>
      <span class="icon-32">
        <Show when={data.icon.active && isActive()} fallback={data.icon.default}>
          {data.icon.active}
        </Show>
      </span>
      <p class="text-sm">{t(`global.nav.${data.name}`)}</p>
    </A>
  )
}

export default NavbarItem
