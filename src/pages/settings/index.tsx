import { useAppContext } from '@/contexts'
import { useThemeContext } from '@kifrud/solid-theme-provider'
import { Component, Show, createSignal } from 'solid-js'

const Settings: Component = () => {
  const ctx = useAppContext()
  const themeCtx = useThemeContext()

  return <div onclick={() => themeCtx.setTheme('monochrome_light')}>light</div>
}

export default Settings
