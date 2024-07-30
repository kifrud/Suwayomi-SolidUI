import { Accessor, Component, type JSX, Setter, Show, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { useGraphQLClient } from '@/contexts'
import { Button } from '@/components'
import { ResultOf } from '@/gql'
import { downloadsOnChapters } from '@/gql/Subscriptions'
/* tslint:disable:no-unused-variable */
import { useHover, useNotification, longPress } from '@/helpers'
import { RoutePaths } from '@/enums'
import { ChapterActions, TChapter, TManga } from '@/types'
import { deleteDownloadedChapter, enqueueChapterDownloads, updateChapters } from '@/gql/Mutations'
import ReadLowerIcon from '~icons/material-symbols/swipe-down-alt-outline'
import AddBookmarkIcon from '~icons/material-symbols/bookmark-add-outline'
import RemoveBookmarkIcon from '~icons/material-symbols/bookmark-remove-outline'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'
import DownloadedIcon from '~icons/material-symbols/download-done'
import BookmarkedIcon from '~icons/material-symbols/bookmark'

interface ChapterListItemProps {
  chapter: TChapter
  manga: TManga | undefined
  chapters: TChapter[] | undefined
  refetch: () => Promise<void>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: TChapter[]
  updateSelected: SetStoreFunction<TChapter[]>
  download: ResultOf<typeof downloadsOnChapters>['downloadChanged']['queue'][number] | undefined
}

const ChapterListItem: Component<ChapterListItemProps> = props => {
  const client = useGraphQLClient()
  const [ref, setRef] = createSignal<HTMLElement>()

  const { isHovered } = useHover(ref)

  const isSelected = createMemo(() =>
    props.selected.map(item => item.id).includes(props.chapter.id)
  )

  const handleAction = async (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement
      target: Element
    },
    action: ChapterActions
  ) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      switch (action) {
        case 'bookmark':
          await client
            .mutation(updateChapters, {
              ids: [Number(props.chapter.id)],
              isBookmarked: !props.chapter.isBookmarked,
            })
            .toPromise()
          break

        case 'read':
          await client
            .mutation(updateChapters, {
              ids: [Number(props.chapter.id)],
              isRead: !props.chapter.isRead,
            })
            .toPromise()
          break

        case 'markAsReadBefore':
          const index = props.chapters?.findIndex(ch => ch.id === props.chapter.id)

          await client
            .mutation(updateChapters, {
              ids: props.chapters
                ?.slice(index, props.chapters?.length)
                .map(item => item.id) as number[],
              isRead: true,
            })
            .toPromise()
          break

        case 'download':
          await client.mutation(enqueueChapterDownloads, { ids: [props.chapter.id] }).toPromise()
          break

        case 'delete':
          await client.mutation(deleteDownloadedChapter, { id: props.chapter.id }).toPromise()
          break
      }
    } catch (error) {
      useNotification('error', { message: error })
    }
  }

  const handleSelect = () => {
    if (!props.selectMode()) {
      props.updateSelectMode(true)
    }

    if (!isSelected()) {
      return props.updateSelected(prev => [...prev, props.chapter])
    }

    return props.updateSelected(prev => prev.filter(item => item.id !== props.chapter.id))
  }

  const handleClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
    if (!props.selectMode()) return

    e.preventDefault()
    e.stopPropagation()
    return handleSelect()
  }

  return (
    <a
      ref={setRef}
      href={`${RoutePaths.manga}/${props.manga?.manga.id}${RoutePaths.chapter}/${props.chapter.id}`}
      class="flex justify-between transition-all p-2 hover:bg-background-muted rounded-lg"
      classList={{
        'border-2 border-bg-foreground': isSelected(),
      }}
      onClick={handleClick}
      use:longPress={250}
      on:LongPressStart={() => props.updateSelectMode(true)}
    >
      <div
        class="flex flex-col justify-between text-sm md:text-base leading-4"
        classList={{
          'opacity-50': props.chapter.isRead,
          'opacity-100': !props.chapter.isRead,
        }}
      >
        <span>{props.chapter.name}</span>
        <div class="flex items-center gap-1">
          <span>#{props.chapter.sourceOrder}</span>•
          <span>{new Date(+props.chapter.uploadDate).toLocaleDateString()}</span>•
          <span>{props.chapter.scanlator}</span>
        </div>
      </div>
      <div class="hidden md:flex items-start">
        <div
          class="flex transition-all"
          classList={{
            'opacity-100': isHovered(),
            'opacity-0': !isHovered(),
          }}
        >
          <Button class="hover:opacity-90 icon-18" onClick={e => handleAction(e, 'bookmark')}>
            <Show when={!props.chapter.isBookmarked} fallback={<RemoveBookmarkIcon />}>
              <AddBookmarkIcon />
            </Show>
          </Button>
          <Button class="hover:opacity-90 icon-18" onClick={e => handleAction(e, 'read')}>
            <Show when={!props.chapter.isRead} fallback={<UnreadIcon />}>
              <ReadIcon />
            </Show>
          </Button>
          <Show when={props.chapter.sourceOrder > 1}>
            <Button
              class="hover:opacity-90 icon-18"
              onClick={e => handleAction(e, 'markAsReadBefore')}
            >
              <ReadLowerIcon />
            </Button>
          </Show>
          <Button
            class="hover:opacity-90 icon-18"
            onClick={e => handleAction(e, props.chapter.isDownloaded ? 'download' : 'delete')}
          >
            <Show when={!props.chapter.isDownloaded} fallback={<DeleteIcon />}>
              <DownloadIcon />
            </Show>
          </Button>
        </div>
        <Show when={props.chapter.isBookmarked || props.chapter.isDownloaded}>
          <div class="flex gap-1">
            <Show when={props.chapter.isBookmarked}>
              <span class="icon-24">
                <BookmarkedIcon />
              </span>
            </Show>
            <Show when={props.chapter.isDownloaded}>
              <span class="icon-24">
                <DownloadedIcon />
              </span>
            </Show>
          </div>
        </Show>
      </div>
    </a>
  )
}

export default ChapterListItem
