import { AppNavbar, Header } from '@/components'
import { useAppContext } from '@/contexts'
import { matches } from '@/helpers'
import { ErrorBoundary, ParentComponent } from 'solid-js'

const MainLayout: ParentComponent = props => {
  const { t } = useAppContext()
  const error = (
    <div class="flex items-center justify-center text-rose-800 w-full h-full">
      {t('global.error')}
    </div>
  )

  return (
    <div class="main-layout">
      <div class="sticky top-0 z-50">
        <Header />
        <hr class="bg-[#3b3b3b] border-none h-[1px]" />
      </div>
      <div class="flex w-full h-full" classList={{ 'flex-col': !matches.md, 'mb-20': !matches.md }}>
        <AppNavbar />
        <ErrorBoundary fallback={error}>{props.children}</ErrorBoundary>
      </div>
    </div>
  )
}

export default MainLayout
