import { Route, Router } from '@solidjs/router'
import App from './App'
import Library from './pages/Library'
import { RoutePaths } from './enums'
import Settings from './pages/settings'

export const AppRoutes = () => {
  // TODO: lazy import each page
  return (
    <Router root={App}>
      <Route path={RoutePaths.library} component={Library} />
      <Route path={RoutePaths.settings} component={Settings} />
    </Router>
  )
}
