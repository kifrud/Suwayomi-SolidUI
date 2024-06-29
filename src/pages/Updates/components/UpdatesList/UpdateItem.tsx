import { A } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import { Image } from '@/components'
import { UpdateNode } from '../..'
import { useGraphQLClient } from '@/contexts'
import { useNotification } from '@/helpers'
import { deleteDownloadedChapter, enqueueChapterDownloads } from '@/gql/Mutations'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'

interface UpdateItemProps {
  item: UpdateNode
  isDownloaded: boolean
}

const UpdateItem: Component<UpdateItemProps> = props => {
  const client = useGraphQLClient()

  const handleDownload = async () => {
    try {
      await client.mutation(enqueueChapterDownloads, { ids: [props.item.id] }).toPromise()
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  const handleDelete = async () => {
    try {
      await client.mutation(deleteDownloadedChapter, { id: props.item.id }).toPromise()
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  return (
    <A
      href={`/manga/${props.item.manga.id}/chapter/${props.item.sourceOrder}`}
      class="flex justify-between w-full"
    >
      <div class="flex gap-1 w-full">
        <div class="h-10 w-10">
          <Image
            class="rounded object-cover min-h-10 min-w-10"
            rounded="none"
            src={props.item.manga.thumbnailUrl!}
            alt=" "
          />
        </div>
        <div class="flex flex-col justify-between text-ellipsis overflow-hidden">
          <span>{props.item.manga.title}</span>
          <span>{props.item.name}</span>
        </div>
      </div>
      <div class="flex gap-1 items-center">
        <Show
          when={!props.isDownloaded}
          fallback={
            <button
              class="action transition-all icon-24 flex justify-center items-center h-8"
              on:click={handleDownload}
            >
              <DeleteIcon />
            </button>
          }
        >
          <button
            class="action transition-all icon-24 flex justify-center items-center h-8"
            on:click={handleDownload}
          >
            <DownloadIcon />
          </button>
        </Show>
      </div>
    </A>
  )
}

export default UpdateItem
