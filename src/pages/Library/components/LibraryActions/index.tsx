import { Accessor, Component, Setter, Show } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { SearchBar } from '@/components'
import { matches } from '@/helpers'
import UpdateCheck from './UpdateCheck'
import { Mangas } from '../..'
import FiltersIcon from '~icons/material-symbols/filter-list'
import SelectAllIcon from '~icons/material-symbols/select-all-rounded'
import './styles.scss'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: number[]
  updateSelected: SetStoreFunction<number[]>
  mangas: Mangas
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  const handleSelectAll = () => {
    props.updateSelectMode(true)
    if (props.selected.length === props.mangas?.length) {
      props.updateSelected([])
    } else {
      const newSelected = Array.from(
        new Set([...props.selected, ...(props.mangas ? props.mangas.map(manga => manga.id) : [])])
      )
      props.updateSelected(newSelected)
    }
  }

  return (
    <>
      <button class="icon-24 transition-all library-action" onClick={handleSelectAll}>
        <SelectAllIcon />
      </button>
      <Show when={!matches.md}>
        <SearchBar mobile />
      </Show>
      <UpdateCheck />
      <button
        class="icon-24 transition-all library-action"
        onClick={() => props.updateShowFilter(prev => !prev)}
      >
        <FiltersIcon />
      </button>
    </>
  )
}

export * from './LibraryFilter'
