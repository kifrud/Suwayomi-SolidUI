import { useLocation } from '@solidjs/router'
import { Component } from 'solid-js'
import { navData } from '../AppNavbar/navData'

const Header: Component<{}> = props => {
  const location = useLocation()
  console.log(location.pathname)

  const title = navData.find(item => item.href === location.pathname.toLowerCase())
  return (
    <header class="header">
      <div></div>
    </header>
  )
}

export default Header
