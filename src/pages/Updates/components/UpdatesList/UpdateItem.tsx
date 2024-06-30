import { A } from '@solidjs/router'
import { Component, Show, createMemo } from 'solid-js'
import { Image } from '@/components'
import { useGraphQLClient } from '@/contexts'
import { useNotification } from '@/helpers'
import { deleteDownloadedChapter, enqueueChapterDownloads, updateChapters } from '@/gql/Mutations'
import { UpdateNode } from '../..'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'

interface UpdateItemProps {
  item: UpdateNode
  isDownloaded: boolean
}

const UpdateItem: Component<UpdateItemProps> = props => {
  const client = useGraphQLClient()

  const itemClasses = createMemo(() =>
    [`updates__item${props.item.isRead ? '--read' : ''}`].join(' ')
  )

  const handleMarkAsRead = async () => {
    try {
      await client.mutation(updateChapters, {
        ids: [props.item.id],
        isRead: true,
        lastPageRead: 0,
      })
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  const handleMarkAsUnread = async () => {
    try {
      await client.mutation(updateChapters, {
        ids: [props.item.id],
        isRead: false,
      })
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

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
      <div class={`flex gap-1 w-full transition-all ${itemClasses()}`}>
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
          when={!props.item.isRead}
          fallback={
            <button
              class="action transition-all icon-24 flex justify-center items-center h-8"
              on:click={handleMarkAsUnread}
            >
              <UnreadIcon />
            </button>
          }
        >
          <button
            class="action transition-all icon-24 flex justify-center items-center h-8"
            on:click={handleMarkAsRead}
          >
            <ReadIcon />
          </button>
        </Show>
        <Show
          when={props.isDownloaded === null && !props.item.isDownloaded}
          fallback={
            <button
              class="action transition-all icon-24 flex justify-center items-center h-8"
              on:click={handleDelete}
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
