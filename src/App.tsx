import { ParentComponent, Show } from 'solid-js'
import { MainLayout, ReaderLayout } from './layouts'
import { useLocation } from '@solidjs/router'
import { Title } from '@solidjs/meta'

const App: ParentComponent = props => {
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
    </>
  )
}

export default App
