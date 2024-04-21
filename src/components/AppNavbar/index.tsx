import { Component, For } from 'solid-js'
import { navData } from '../navData'
import NavbarItem from './NavbarItem'
import './styles.scss'

const AppNavbar: Component = () => {
  return (
    <div class="navbar">
      <For each={navData()}>{item => <NavbarItem data={item} />}</For>
    </div>
  )
}

export default AppNavbar
