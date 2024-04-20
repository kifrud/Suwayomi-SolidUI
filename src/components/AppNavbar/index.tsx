import { Component, For, createEffect } from 'solid-js'
import './styles.scss'
import { navData } from '../navData'
import NavbarItem from './NavbarItem'

const AppNavbar: Component = () => {
  return (
    <div class="navbar">
      <For each={navData()}>{item => <NavbarItem data={item} />}</For>
    </div>
  )
}

export default AppNavbar
