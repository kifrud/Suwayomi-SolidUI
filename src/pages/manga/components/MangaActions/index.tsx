import { Button } from '@/components'
import { Component, Setter } from 'solid-js'
import FiltersIcon from '~icons/material-symbols/filter-list'
import MenuIcon from '~icons/material-symbols/more-vert'
import RefreshIcon from '~icons/material-symbols/refresh'

interface MangaActionsProps {
  refresh: () => void
  updateShowFilter: Setter<boolean>
}

export const MangaActions: Component<MangaActionsProps> = props => {
  return (
    <>
      <Button onClick={() => props.updateShowFilter(prev => !prev)}>
        <FiltersIcon />
      </Button>
      {/* <Button onClick={props.refresh}>
        <RefreshIcon />
      </Button> */}
      <Button>
        <MenuIcon />
      </Button>
    </>
  )
}

export * from './MangaFilters'
