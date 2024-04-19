import { Component } from 'solid-js'
import { ThemeProvider } from 'solid-theme-provider'

const Settings: Component<{}> = props => {
  return (
    <div>
      <ThemeProvider label="Toggle Theme" />
    </div>
  )
}

export default Settings
