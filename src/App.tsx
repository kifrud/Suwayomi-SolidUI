import { ParentComponent } from 'solid-js'
import AppNavbar from './components/AppNavbar'

const App: ParentComponent = props => {

  return (
    <>
      <AppNavbar />
      {props.children}
    </>
  )
}

export default App
