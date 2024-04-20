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
      <Header />
      <hr class='opacity-15'/>
      <div class='px-2' classList={{ flex: matches.md }}>
        <Show when={matches.md}>
          <AppNavbar />
        </Show>
        {props.children}
      </div>
    </div>
  )
}

export default MainLayout
