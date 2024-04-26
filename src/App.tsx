import { ParentComponent, Show } from 'solid-js'
import { MainLayout, ReaderLayout } from './layouts'
import { useLocation } from '@solidjs/router'
import { ThemeProvider } from 'solid-theme-provider'
import themes from '@/themes.json'
import { useAppContext } from './contexts'
import { Title } from '@solidjs/meta'

const App: ParentComponent = props => {
  const { theme } = useAppContext()
  const location = useLocation()
  return (
    <>
      <Title>Suwayomi</Title>
      <Show
        when={location.pathname.toLowerCase().includes('chapter')}
        fallback={<MainLayout>{props.children}</MainLayout>}
      >
        <ReaderLayout>{props.children}</ReaderLayout>
      </Show>
      <ThemeProvider styles={{ component: 'hidden' }} themes={themes} default={theme} />
    </>
  )
}

export default App
