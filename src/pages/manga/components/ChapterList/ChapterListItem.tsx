import { Component, Show, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { useGraphQLClient } from '@/contexts'
import { Button } from '@/components'
import { useHover, useNotification } from '@/helpers'
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
  refetch: () => Promise<void>
}

const ChapterListItem: Component<ChapterListItemProps> = props => {
  const client = useGraphQLClient()
  const [ref, setRef] = createSignal<HTMLElement>()

  const { isHovered } = useHover(ref)

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
          await client
            .mutation(updateChapters, {
              ids: props.manga?.manga.chapters.nodes
                .filter(ch => ch.id !== props.chapter.id)
                .map(item => item.id) as number[],
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
      props.refetch()
    } catch (error) {
      useNotification('error', { message: error })
    }
  }

  return (
    <A
      ref={setRef}
      href={`${RoutePaths.manga}/${props.manga?.manga.id}${RoutePaths.chapter}/${props.chapter.id}`}
      class="flex justify-between transition-all p-2 hover:bg-background-muted rounded-lg"
    >
      <div
        class="flex flex-col justify-between"
        classList={{
          'opacity-50': props.chapter.isRead,
          'opacity-100': !props.chapter.isRead,
        }}
      >
        <span>{props.chapter.name}</span>
        <div class="flex gap-1">
          <span>#{props.chapter.sourceOrder}</span>
          <span>{new Date(+props.chapter.uploadDate).toLocaleDateString()}</span>
          <span>{props.chapter.scanlator}</span>
        </div>
      </div>
      <div class="flex items-start">
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
    </A>
  )
}

export default ChapterListItem
