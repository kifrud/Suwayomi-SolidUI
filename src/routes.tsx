import { Route, Router } from '@solidjs/router'
import App from './App'
import Library from './pages/Library'
import { RoutePaths } from './enums'
import Settings from './pages/settings'
import Providers from './providers'

export const AppRoutes = () => {
  // TODO: lazy import each page
  return (
    <Router
      root={props => (
        <Providers>
          <App>{props.children}</App>
        </Providers>
      )}
    >
      <Route path={RoutePaths.library} component={Library} />
      <Route path={RoutePaths.settings} component={Settings} />
    </Router>
  )
}
