import { useLocation } from '@solidjs/router'
import { Component, Show, createMemo } from 'solid-js'
import { navData } from '../navData'
import { useAppContext, useHeaderContext } from '@/contexts'
import './styles.scss'

const Header: Component = () => {
  const { t } = useAppContext()
  const ctx = useHeaderContext()
  const location = useLocation()

  const routeData = createMemo(
    () => navData().find(item => item.href === location.pathname.toLowerCase())!
  )

  const defaultTitle = createMemo(() => (
    <>
      <span class="icon-32">{routeData().icon.active ?? routeData().icon.default}</span>
      <div class="flex items-center gap-1">
        <h1>{t(`global.nav.${routeData().name}`)}</h1>
        {ctx.headerTitleData()}
      </div>
    </>
  ))

  return (
    <header class="header">
      <div class="flex items-center gap-2">
        <Show when={ctx.headerTitle()} fallback={defaultTitle()}>
          {ctx.headerTitle()}
          {ctx.headerTitleData()}
        </Show>
      </div>
    </header>
  )
}

export default Header
