import { ParentComponent } from 'solid-js'
import { Toast } from '@kobalte/core/toast'
import { Title } from '@solidjs/meta'
import { Portal } from 'solid-js/web'
import { useDownloadSubscription, useUpdaterSubscription } from './helpers'

const App: ParentComponent = props => {
  useUpdaterSubscription()
  useDownloadSubscription()

  return (
    <>
      <Title>Suwayomi</Title>
      {props.children}
      <Portal>
        <Toast.Region pauseOnPageIdle pauseOnInteraction limit={7}>
          <Toast.List class="toast__list" />
        </Toast.Region>
      </Portal>
    </>
  )
}

export default App
