/* @refresh reload */
import { render } from 'solid-js/web'
import { AppRoutes } from './routes'
import '@/styles/index.scss'
import Providers from './providers'

const root = document.getElementById('root')

render(
  () => (
    <Providers>
      <AppRoutes />
    </Providers>
  ),
  root!
)
