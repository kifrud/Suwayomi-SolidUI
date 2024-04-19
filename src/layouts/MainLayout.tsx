import { AppNavbar, Header } from '@/components'
import { useAppContext } from '@/contexts'
import { ParentComponent } from 'solid-js'

const MainLayout: ParentComponent = props => {
  const ctx = useAppContext()
  console.log(ctx.locale);
  
  return (
    <div class="main-layout">
      <Header />
      <AppNavbar />
      {props.children}
    </div>
  )
}

export default MainLayout
