import { Accessor, Component, Setter, Show } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Button, SearchBar, UpdateCheck } from '@/components'
import { matches } from '@/helpers'
import { Mangas } from '@/types'
import FiltersIcon from '~icons/material-symbols/filter-list'
import SelectAllIcon from '~icons/material-symbols/select-all-rounded'
import DeselectAllIcon from '~icons/material-symbols/deselect-rounded'
import Select from '~icons/material-symbols/select-rounded'
import './styles.scss'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: NonNullable<Mangas>
  updateSelected: SetStoreFunction<NonNullable<Mangas>>
  mangas: Mangas
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  const handleSelectAll = () => {
    props.updateSelectMode(true)
    if (props.selected.length === props.mangas?.length) {
      props.updateSelected([])
    } else {
      const newSelected = Array.from(
        new Set([...props.selected, ...(props.mangas ? props.mangas : [])])
      )
      props.updateSelected(newSelected)
    }
  }

  const handleSelectionState = () => {
    props.updateSelectMode(true)
    const allIds = props.mangas ? props.mangas : []
    const newSelected = allIds.filter(item => !props.selected.includes(item))
    props.updateSelected(newSelected)
  }

  return (
    <>
      <Show when={props.selectMode()}>
        <Button onClick={handleSelectAll}>
          <Show when={props.selected.length === props.mangas?.length} fallback={<SelectAllIcon />}>
            <DeselectAllIcon />
          </Show>
        </Button>
        <Button onClick={handleSelectionState}>
          <Select />
        </Button>
      </Show>
      <Show when={!props.selectMode()}>
        <Show when={!matches.md}>
          <SearchBar mobile />
        </Show>
        <UpdateCheck />
      </Show>
      <Button onClick={() => props.updateShowFilter(prev => !prev)}>
        <FiltersIcon />
      </Button>
    </>
  )
}

export * from './LibraryFilter'
export * from './SelectionActions'
