import { SearchBar } from '@/components'
import { matches } from '@/helpers'
import { Component, Setter, Show } from 'solid-js'
import FiltersIcon from '~icons/material-symbols/filter-list'
import UpdateCheck from './UpdateCheck'
import './styles.scss'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  return (
    <>
      <Show when={!matches.md}>
        <SearchBar mobile />
      </Show>
      <UpdateCheck />
      <button class="icon-32 p-1 transition-all library-action" onClick={() => props.updateShowFilter(prev => !prev)}>
        <FiltersIcon />
      </button>
    </>
  )
}

export * from './LibraryFilter'
