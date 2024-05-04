import { useLocation } from '@solidjs/router'
import { Component, Show, createMemo } from 'solid-js'
import { navData } from '../navData'
import { useAppContext, useHeaderContext } from '@/contexts'
import { Title } from '@solidjs/meta'
import './styles.scss'

const Header: Component = () => {
  const { t } = useAppContext()
  const ctx = useHeaderContext()
  const location = useLocation()

  const routeData = createMemo(() =>
    navData().find(item => item.href === location.pathname.toLowerCase())
  )

  const defaultTitle = createMemo(() => (
    <Show when={routeData()}>
      <span class="icon-32 hidden sm:block">
        {routeData()!.icon.active ?? routeData()!.icon.default}
      </span>
      <div class="flex items-center gap-1">
        <h1>{t(`global.nav.${routeData()!.name}`)}</h1>
        {ctx.headerTitleData}
      </div>
    </Show>
  ))

  return (
    <header class="header">
      <Title>{routeData() ? t(`global.nav.${routeData()!.name}`) : 'Suwayomi'}</Title>
      <div class="flex items-center gap-2">
        <Show when={ctx.headerTitle} fallback={defaultTitle()}>
          {ctx.headerTitle}
        </Show>
      </div>
      <div class="flex items-center gap-2 w-max">{ctx.headerCenter}</div>
      <div class="flex items-center gap-2">{ctx.headerEnd}</div>
    </header>
  )
}

export default Header
