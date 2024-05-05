import { Component, Setter } from 'solid-js'
import FiltersIcon from '~icons/material-symbols/filter-list'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  return (
    <button class="icon-32" onClick={() => props.updateShowFilter(prev => !prev)}>
      <FiltersIcon />
    </button>
  )
}

export * from './LibraryFilter'
