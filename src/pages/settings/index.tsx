// import { useAppContext } from '@/contexts'
import { useNotification } from '@/helpers'
// import { useThemeContext } from '@kifrud/solid-theme-provider'
import { Component } from 'solid-js'

const Settings: Component = () => {
  // const ctx = useAppContext()
  // const themeCtx = useThemeContext()

  return (
    <div>
      {/* <div onclick={() => themeCtx.setTheme('monochrome_light')}>light</div> */}
      <div onclick={() => useNotification('info')}>notificate</div>
      <div onclick={() => useNotification('error')}>notificate</div>
      <div onclick={() => useNotification('success')}>notificate</div>
      <div onclick={() => useNotification('warning')}>notificate</div>

    </div>
  )
}

export default Settings
