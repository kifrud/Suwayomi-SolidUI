import { Accessor, Component, Ref, Setter, Show } from 'solid-js'
import { SetStoreFunction, unwrap } from 'solid-js/store'
import { Button } from '@/components'
import { matches, selectAll, selectFlip } from '@/helpers'
import { TChapter, TManga } from '@/types'
import MangaMenu from './MangaMenu'
import FiltersIcon from '~icons/material-symbols/filter-list'
import DownloadIcon from '~icons/material-symbols/download-2'
import SelectAllIcon from '~icons/material-symbols/select-all-rounded'
import DeselectAllIcon from '~icons/material-symbols/deselect-rounded'
import Select from '~icons/material-symbols/select-rounded'

interface MangaActionsProps {
  refresh: () => void
  selected: TChapter[]
  updateSelected: SetStoreFunction<TChapter[]>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  updateShowFilter: Setter<boolean>
  manga: TManga | undefined
  filtersButtonRef: Ref<HTMLButtonElement>
}

export const MangaActions: Component<MangaActionsProps> = props => {
  return (
    <>
      <Button
        onClick={() =>
          selectAll(
            unwrap(props.selected),
            props.updateSelectMode,
            props.updateSelected,
            props.manga?.manga.chapters.nodes!
          )
        }
      >
        <Show
          when={props.selected.length === props.manga?.manga.chapters.nodes.length}
          fallback={<SelectAllIcon />}
        >
          <DeselectAllIcon />
        </Show>
      </Button>
      <Show when={props.selectMode()}>
        <Button
          onClick={() =>
            selectFlip(
              unwrap(props.selected),
              props.updateSelected,
              props.manga?.manga.chapters.nodes!
            )
          }
        >
          <Select />
        </Button>
      </Show>
      <Show when={!props.selectMode()}>
        <Button>
          <DownloadIcon />
        </Button>
      </Show>
      <Button onClick={() => props.updateShowFilter(prev => !prev)} ref={props.filtersButtonRef}>
        <FiltersIcon />
      </Button>
      <Show when={matches.lg}>
        <MangaMenu refresh={props.refresh} manga={props.manga} />
        {/* FIXME: due to virtual list items being absolute the dropdown can't be closed on screens narrower */}
      </Show>
    </>
  )
}

export * from './MangaFilter'
