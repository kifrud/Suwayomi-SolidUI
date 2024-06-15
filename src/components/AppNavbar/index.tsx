import { Component, For, createMemo } from 'solid-js'
import { matches } from '@/helpers'
import { navData } from '../navData'
import NavbarItem from './NavbarItem'
import './styles.scss'

const AppNavbar: Component = () => {
  const navbarType = createMemo(() => (matches.md ? 'desktop' : 'mobile'))

  return (
    <div class={`navbar navbar--${navbarType()}`}>
      <For each={navData()}>{item => <NavbarItem data={item} />}</For>
    </div>
  )
}

export default AppNavbar
