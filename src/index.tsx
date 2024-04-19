/* @refresh reload */
import { render } from 'solid-js/web'
import { AppRoutes } from './routes'
import 'solid-devtools'
import '@/styles/index.scss'

const root = document.getElementById('root')

render(() => <AppRoutes />, root!)
