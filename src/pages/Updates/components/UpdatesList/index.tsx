import { Component, For } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { useGraphQLClient } from '@/contexts'
import { getDownloadStatus } from '@/gql/Queries'
import { UpdateNode } from '../..'
import UpdateItem from './UpdateItem'
import './styles.scss'

interface UpdatesListProps {
  updates: Record<string, UpdateNode[]>
}

const UpdatesList: Component<UpdatesListProps> = props => {
  const client = useGraphQLClient()

  const downloadStatus = createQuery(() => ({
    queryKey: ['donwloadStatus'],
    queryFn: async () => client.query(getDownloadStatus, {}).toPromise(),
  }))

  return (
    <For each={Object.entries(props.updates)}>
      {([date, items]) => (
        <>
          <span class="updates__group-date">{date}</span>
          <For each={items}>
            {item => (
              <UpdateItem
                item={item}
                isDownloaded={
                  !!downloadStatus.data?.data?.downloadStatus.queue.find(
                    q =>
                      item.sourceOrder === q.chapter.sourceOrder &&
                      item.manga.id === q.chapter.manga.id
                  )
                }
              />
            )}
          </For>
        </>
      )}
    </For>
  )
}

export default UpdatesList
