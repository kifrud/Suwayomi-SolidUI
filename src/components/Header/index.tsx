import { useLocation } from '@solidjs/router'
import { Component, createMemo } from 'solid-js'
import { navData } from '../navData'
import { useAppContext } from '@/contexts'
import './styles.scss'

const Header: Component = () => {
  const { t, headerData } = useAppContext()
  const location = useLocation()

  const routeData = createMemo(
    () => navData().find(item => item.href === location.pathname.toLowerCase())!
  )

  return (
    <header class="header">
      <div class="flex items-center gap-2">
        <span class="icon-32">{routeData().icon.active ?? routeData().icon.default}</span>
        <div class="flex items-center gap-1">
          <h1>{t(`global.nav.${routeData().name}`)}</h1>
          {headerData()}
        </div>
      </div>
    </header>
  )
}

export default Header
