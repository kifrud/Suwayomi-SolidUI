import { Component, Setter } from 'solid-js'

interface LibraryActionsProps {
  updateShowFilter: Setter<boolean>
}

export const LibraryActions: Component<LibraryActionsProps> = props => {
  return <button onClick={() => props.updateShowFilter(prev => !prev)}>filters</button>
}

export * from './LibraryFilter'
