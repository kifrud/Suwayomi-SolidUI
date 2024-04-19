import { ParentComponent } from 'solid-js'
import { MainLayout } from './layouts'
import Providers from './providers'

const App: ParentComponent = props => {
  return (
    <Providers>
      <MainLayout>{props.children}</MainLayout>
    </Providers>
  )
}

export default App
