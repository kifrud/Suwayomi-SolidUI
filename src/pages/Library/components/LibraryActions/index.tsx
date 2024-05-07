import { SearchBar } from '@/components'
import { matches } from '@/helpers'
import { Component, Setter, Show, createSignal } from 'solid-js'
import FiltersIcon from '~icons/material-symbols/filter-list'
import SearchIcon from '~icons/material-symbols/search'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  return (
    <>
      {/* <Show when={!matches.md}>
        <button class="icon-32 flex items-center">
          <SearchIcon />
        </button>
      </Show> */}
      <Show when={!matches.md}>
        <SearchBar mobile />
      </Show>
      <button class="icon-32" onClick={() => props.updateShowFilter(prev => !prev)}>
        <FiltersIcon />
      </button>
    </>
  )
}

export * from './LibraryFilter'
