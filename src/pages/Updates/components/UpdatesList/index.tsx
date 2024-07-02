import { Component, For } from 'solid-js'
import { useDownloadSubscription } from '@/helpers'
import { UpdateNode } from '../..'
import UpdateItem from './UpdateItem'
import './styles.scss'

interface UpdatesListProps {
  updates: Record<string, UpdateNode[]>
  refetchUpdates: () => void
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
