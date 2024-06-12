import { ParentComponent, Show } from 'solid-js'
import { Toast } from '@kobalte/core/toast'
import { MainLayout, ReaderLayout } from './layouts'
import { useLocation } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { useUpdaterSubscription } from './helpers'
import { Portal } from 'solid-js/web'

const App: ParentComponent = props => {
  const location = useLocation()

  useUpdaterSubscription()

  return (
    <>
      <Title>Suwayomi</Title>
      <Show
        when={location.pathname.toLowerCase().includes('chapter')}
        fallback={<MainLayout>{props.children}</MainLayout>}
      >
        <ReaderLayout>{props.children}</ReaderLayout>
      </Show>
      <Portal>
        <Toast.Region pauseOnPageIdle pauseOnInteraction>
          <Toast.List class='toast__list' />
        </Toast.Region>
      </Portal>
    </>
  )
}

export default App
