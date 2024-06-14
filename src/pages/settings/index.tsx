import { useAppContext } from '@/contexts'
import { useNotification } from '@/helpers'
import { useThemeContext } from '@kifrud/solid-theme-provider'
import { Component } from 'solid-js'

const Settings: Component = () => {
  const ctx = useAppContext()
  const themeCtx = useThemeContext()

  return (
    <div>
      {/* <div onclick={() => themeCtx.setTheme('monochrome_light')}>light</div> */}
      {/* <div onclick={() => useNotification('info')}>notificate</div> */}
    </div>
  )
}

export default Settings
