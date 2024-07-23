import { resolveFirst } from '@solid-primitives/refs'
import { createSwitchTransition } from '@solid-primitives/transition-group'
import { ParentComponent } from 'solid-js'
// TODO: improve
const Transition: ParentComponent = props => {
  const animationMap = new Map<Element, Animation>()

  const el = resolveFirst(
    () => props.children,
    (item): item is HTMLElement => item instanceof HTMLElement
  )

  const animateIn = (el: HTMLElement, done: VoidFunction) => {
    if (!el.isConnected) return done()

    document.body.style.overflow = 'hidden'

    const a = el.animate(
      [
        { opacity: 0, transform: 'translate(301px)' },
        { opacity: 1, transform: 'translate(0px)' },
      ],
      {
        duration: 150,
      }
    )
    animationMap.set(el, a)

    const complete = () => {
      done()
      document.body.style.overflow = 'auto'

      animationMap.delete(el)
    }

    a.finished.then(complete).catch(complete)
  }

  const animateOut = (el: HTMLElement, done: VoidFunction) => {
    if (!el.isConnected) return done()

    document.body.style.overflow = 'hidden'

    animationMap.get(el)?.cancel()

    const complete = () => {
      done()
      document.body.style.overflow = 'auto'
    }

    el.animate(
      [
        { opacity: 1, transform: `translate(0px)` },
        { opacity: 0, transform: 'translate(301px)' },
      ],
      {
        duration: 150,
      }
    )
      .finished.then(complete)
      .catch(complete)
  }

  const transition = createSwitchTransition(el, {
    onEnter(el, done) {
      queueMicrotask(() => animateIn(el, done))
    },
    onExit(el, done) {
      animateOut(el, done)
    },
    mode: 'in-out',
  })

  return <>{transition()}</>
}

export default Transition
