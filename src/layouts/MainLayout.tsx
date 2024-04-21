import { AppNavbar, Header } from '@/components'
import { createBreakpoints } from '@solid-primitives/media'
import { ParentComponent, Show } from 'solid-js'

const MainLayout: ParentComponent = props => {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }

  const matches = createBreakpoints(breakpoints)

  return (
    <div class="main-layout">
      <div class="sticky top-0 z-50">
        <Header />
        <hr class="bg-[#3b3b3b] border-none h-[1px]" />
      </div>
      <div class="flex" classList={{ 'flex-col': !matches.md, 'gap-2': matches.md }}>
        <Show when={matches.md}>
          <AppNavbar />
        </Show>
        {props.children}
      </div>
    </div>
  )
}

export default MainLayout
