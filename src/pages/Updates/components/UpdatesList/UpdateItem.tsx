import { Accessor, Component, type JSX, Setter, Show, createMemo } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Progress } from '@kobalte/core/progress'
import { Image } from '@/components'
import { useGraphQLClient } from '@/contexts'
import { useNotification, longPress } from '@/helpers'
import { deleteDownloadedChapter, enqueueChapterDownloads, updateChapters } from '@/gql/Mutations'
import { downloadsOnChapters } from '@/gql/Subscriptions'
import { ResultOf } from '@/gql'
import { BaseActions } from '@/types'
import { UpdateNode } from '../..'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'

interface UpdateItemProps {
  item: UpdateNode
  download: ResultOf<typeof downloadsOnChapters>['downloadChanged']['queue'][number] | undefined
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: UpdateNode[]
  updateSelected: SetStoreFunction<UpdateNode[]>
  refetchUpdates: () => void
}

const UpdateItem: Component<UpdateItemProps> = props => {
  const client = useGraphQLClient()

  const itemClasses = createMemo(() =>
    [
      'flex',
      'gap-1',
      'w-full',
      'relative',
      'z-10',
      `updates__item${props.item.isRead ? '--read' : ''}`,
    ].join(' ')
  )
  const progressValue = createMemo(() => (props.download?.progress ?? 0) * 100)
  const isSelected = createMemo(() => props.selected.map(item => item.id).includes(props.item.id))

  const handleAction = async (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement
      target: Element
    },
    action: BaseActions
  ) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      switch (action) {
        case 'download':
          await client.mutation(enqueueChapterDownloads, { ids: [props.item.id] }).toPromise()
          break

        case 'delete':
          await client.mutation(deleteDownloadedChapter, { id: props.item.id }).toPromise()
          break

        case 'markAsRead':
          await client.mutation(updateChapters, {
            ids: [props.item.id],
            isRead: true,
            lastPageRead: 0,
          })
          break

        case 'markAsUnread':
          await client.mutation(updateChapters, {
            ids: [props.item.id],
            isRead: false,
          })
          break
      }
    } catch (error) {
      useNotification('error', { message: error as string })
    }
    props.refetchUpdates()
  }

  const handleSelect = () => {
    if (!props.selectMode()) {
      props.updateSelectMode(true)
    }

    if (!isSelected()) {
      return props.updateSelected(prev => [...prev, props.item])
    }

    return props.updateSelected(prev => prev.filter(item => item.id !== props.item.id))
  }

  const handleClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
    if (!props.selectMode()) return

    e.preventDefault()
    e.stopPropagation()
    return handleSelect()
  }

  return (
    <a
      href={`/manga/${props.item.manga.id}/chapter/${props.item.sourceOrder}`}
      class="relative flex justify-between w-full transition-all p-1 rounded-lg"
      classList={{ 'border-2 border-bg-foreground': isSelected() }}
      onClick={handleClick}
      use:longPress
      on:LongPressStart={() => props.updateSelectMode(true)}
    >
      <div class={itemClasses()}>
        <div class="h-10 w-10">
          <Image
            class="rounded object-cover min-h-10 min-w-10"
            rounded="none"
            src={props.item.manga.thumbnailUrl!}
            alt=" "
          />
        </div>
        <div class="flex flex-col justify-between text-ellipsis overflow-hidden">
          <span class="transition-all">{props.item.manga.title}</span>
          <span class="transition-all">{props.item.name}</span>
        </div>
      </div>
      <div class="relative z-10 flex gap-1 items-center">
        <Show
          when={!props.item.isRead}
          fallback={
            <button
              class="action transition-all icon-24 flex justify-center items-center h-8"
              on:click={e => handleAction(e, 'markAsUnread')}
            >
              <UnreadIcon />
            </button>
          }
        >
          <button
            class="action transition-all icon-24 flex justify-center items-center h-8"
            on:click={e => handleAction(e, 'markAsRead')}
          >
            <ReadIcon />
          </button>
        </Show>
        <Show
          when={!props.item.isDownloaded}
          fallback={
            <button
              class="action transition-all icon-24 flex justify-center items-center h-8"
              on:click={e => handleAction(e, 'delete')}
            >
              <DeleteIcon />
            </button>
          }
        >
          <button
            class="action transition-all icon-24 flex justify-center items-center h-8"
            on:click={e => handleAction(e, 'download')}
            disabled={(props.download?.progress ?? 0) > 0}
          >
            <DownloadIcon />
          </button>
        </Show>
      </div>
      <Progress value={progressValue()} class="absolute bottom-0 z-0 w-full h-full">
        <Progress.Track class="h-full">
          <Progress.Fill class="updates__item-download-progress h-full" />
        </Progress.Track>
      </Progress>
    </a>
  )
}

export default UpdateItem
