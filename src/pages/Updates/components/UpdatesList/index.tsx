import { Accessor, Component, For, Setter } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { useDownloadSubscription } from '@/helpers'
import { UpdateNode } from '../..'
import UpdateItem from './UpdateItem'
import './styles.scss'

interface UpdatesListProps {
  updates: Record<string, UpdateNode[]>
  refetchUpdates: () => void
  selectMode: Accessor<boolean>
  updateSelectedMode: Setter<boolean>
  selected: UpdateNode[]
  updateSelected: SetStoreFunction<UpdateNode[]>
}

const UpdatesList: Component<UpdatesListProps> = props => {
  const downloadStatus = useDownloadSubscription()

  return (
    <For each={Object.entries(props.updates)}>
      {([date, items]) => (
        <>
          <span class="updates__group-date">{date}</span>
          <For each={items}>
            {item => (
              <UpdateItem
                item={item}
                selected={props.selected}
                updateSelected={props.updateSelected}
                selectMode={props.selectMode}
                updateSelectMode={props.updateSelectedMode}
                download={downloadStatus()?.downloadChanged.queue.find(
                  q =>
                    item.sourceOrder === q.chapter.sourceOrder &&
                    item.manga.id === q.chapter.manga.id
                )}
                refetchUpdates={props.refetchUpdates}
              />
            )}
          </For>
        </>
      )}
    </For>
  )
}

export default UpdatesList
