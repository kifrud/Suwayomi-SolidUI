import { Component, Setter, Show } from 'solid-js'
import { Button } from '@/components'
import { matches } from '@/helpers'
import { TManga } from '@/types'
import MangaMenu from './MangaMenu'
import FiltersIcon from '~icons/material-symbols/filter-list'
import DownloadIcon from '~icons/material-symbols/download-2'

interface MangaActionsProps {
  refresh: () => void
  updateShowFilter: Setter<boolean>
  manga: TManga | undefined
}

export const MangaActions: Component<MangaActionsProps> = props => {
  return (
    <>
      <Button>
        <DownloadIcon />
      </Button>
      <Button onClick={() => props.updateShowFilter(prev => !prev)}>
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
