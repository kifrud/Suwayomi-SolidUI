import { useAppContext } from '@/contexts'
import { Component } from 'solid-js'

const Settings: Component = () => {
  const ctx = useAppContext()
  return <div onclick={() => ctx.setTheme('warm_light')}>light</div>
}

export default Settings
