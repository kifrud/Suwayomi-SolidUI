import { AppNavbar, Header } from '@/components'
import { matches } from '@/helpers'
import { ParentComponent } from 'solid-js'

const MainLayout: ParentComponent = props => {
  return (
    <div class="main-layout">
      <div class="sticky top-0 z-50">
        <Header />
        <hr class="bg-[#3b3b3b] border-none h-[1px]" />
      </div>
      <div
        class="flex"
        classList={{ 'flex-col': !matches.md, 'gap-2': matches.md }}
      >
        <AppNavbar />
        {props.children}
      </div>
    </div>
  )
}

export default MainLayout
