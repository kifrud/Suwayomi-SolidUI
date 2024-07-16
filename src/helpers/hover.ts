import { Accessor, createSignal, onCleanup, onMount } from 'solid-js'
// TODO: rewrite
type HoverPointerType = 'mouse' | 'pen'

type PointerType = HoverPointerType | 'touch' | 'keyboard' | 'virtual'
/**
 * Function to listen to hover change
 *
 * @param el listening element (pass as signal)
 * @returns isHovered state as signal
 */
export const useHover = (el: Accessor<HTMLElement | undefined>) => {
  // TODO: make it available not only for signal ref
  const [isHovered, setIsHovered] = createSignal(false)

  const handleHover = (e: Event, pointerType: PointerType) => {
    if (
      pointerType === 'touch' ||
      isHovered() ||
      !(e.currentTarget as HTMLElement).contains(e.target as HTMLElement)
    ) {
      return
    }

    setIsHovered(true)
  }

  const handlePointerLeave = () => setIsHovered(false)

  onMount(() => {
    if (el()) {
      el()!.addEventListener('pointerenter', e => handleHover(e, e.pointerType as PointerType))
      el()!.addEventListener('pointerleave', handlePointerLeave)
    }
  })

  onCleanup(() => {
    if (el()) {
      el()!.removeEventListener('pointerenter', e => handleHover(e, e.pointerType as PointerType))
      el()!.removeEventListener('pointerleave', handlePointerLeave)
    }
  })

  return {
    isHovered,
  }
}
