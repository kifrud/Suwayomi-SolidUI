import { Route, Router } from '@solidjs/router'
import { RoutePaths } from './enums'
import { ErrorBoundary, lazy } from 'solid-js'
import App from './App'
import Providers from './providers'

export const AppRoutes = () => {
  const Library = lazy(() => import('./pages/Library'))
  const Updates = lazy(() => import('./pages/Updates'))
  const Browse = lazy(() => import('./pages/Browse'))
  const Downloads = lazy(() => import('./pages/Downloads'))
  const Settings = lazy(() => import('./pages/Settings'))
  const Manga = lazy(() => import('./pages/manga'))

  return (
    <Router
      root={props => (
        <Providers>
          <App>{props.children}</App>
        </Providers>
      )}
    >
      <ErrorBoundary fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}>
        <Route path={RoutePaths.library} component={Library} />
        <Route path={RoutePaths.updates} component={Updates} />
        <Route path={RoutePaths.browse} component={Browse} />
        <Route path={RoutePaths.downloads} component={Downloads} />
        <Route path={RoutePaths.settings} component={Settings} />
        <Route path={`${RoutePaths.manga}/:id`} component={Manga} />
      </ErrorBoundary>
    </Router>
  )
}
