import { Button } from '@/components'
import { Component, Setter } from 'solid-js'
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
      <MangaMenu refresh={props.refresh} manga={props.manga} />
    </>
  )
}

export * from './MangaFilter'
