import { onCleanup, onMount } from 'solid-js'

/**
 * Check if clicked outside of element and disptach action
 * @param ref element to check
 * @param action callback function to be called after clicked ouside of ref
 * @param ignoreRefs array of elements to ignore clicks on
 */
export const useOutside = (ref: HTMLElement, action: () => void, ignoreRefs?: HTMLElement[]) => {
  const handleClick = (event: MouseEvent) => {
    if (ignoreRefs && ignoreRefs.some(ignoreRef => ignoreRef.contains(event.target as Node))) {
      return
    }
    if (!ref.contains(event.target as Node)) {
      action()
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClick)
  })

  onCleanup(() => {
    document.removeEventListener('click', handleClick)
  })
}
