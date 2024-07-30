import { Accessor, Component, Ref, Setter, Show } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Button, SearchBar, UpdateCheck } from '@/components'
import { matches, selectAll, selectFlip } from '@/helpers'
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
  filtersButtonRef: Ref<HTMLButtonElement>
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  return (
    <>
      <Button
        onClick={() =>
          selectAll(props.selected, props.updateSelectMode, props.updateSelected, props.mangas!)
        }
      >
        <Show when={props.selected.length === props.mangas?.length} fallback={<SelectAllIcon />}>
          <DeselectAllIcon />
        </Show>
      </Button>
      <Show when={props.selectMode()}>
        <Button onClick={() => selectFlip(props.selected, props.updateSelected, props.mangas!)}>
          <Select />
        </Button>
      </Show>
      <Show when={!props.selectMode()}>
        <Show when={!matches.md}>
          <SearchBar mobile />
        </Show>
        <UpdateCheck />
      </Show>
      <Button ref={props.filtersButtonRef} onClick={() => props.updateShowFilter(prev => !prev)}>
        <FiltersIcon />
      </Button>
    </>
  )
}

export * from './LibraryFilter'
export * from './SelectionActions'
