import { Setter } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'

export const selectAll = <T extends unknown>(
  selected: T[],
  updateSelectMode: Setter<boolean>,
  updateSelected: SetStoreFunction<T[]>,
  items: T[]
) => {
  updateSelectMode(true)
  if (selected.length === items.length) {
    updateSelected([])
  } else {
    const newSelected = new Set([...selected, ...(items ? items : [])])

    updateSelected(Array.from(newSelected))
  }
}

export const selectFlip = <T extends unknown>(
  selected: T[],
  updateSelected: SetStoreFunction<T[]>,
  items: T[]
) => {
  const all = items ? items : []
  const newSelected = all.filter(item => !selected.includes(item))
  updateSelected(newSelected)
}
