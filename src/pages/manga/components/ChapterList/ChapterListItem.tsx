import { Component, Show, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { Button } from '@/components'
import { useHover } from '@/helpers'
import { RoutePaths } from '@/enums'
import { TChapter, TManga } from '@/types'
import ReadLowerIcon from '~icons/material-symbols/swipe-down-alt-outline'
import AddBookmarkIcon from '~icons/material-symbols/bookmark-add-outline'
import RemoveBookmarkIcon from '~icons/material-symbols/bookmark-remove-outline'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'

interface ChapterListItemProps {
  chapter: TChapter
  manga: TManga | undefined
}

const ChapterListItem: Component<ChapterListItemProps> = props => {
  const [ref, setRef] = createSignal<HTMLElement>()

  const { isHovered } = useHover(ref)

  return (
    <A
      ref={setRef}
      href={`${RoutePaths.manga}/${props.manga?.manga.id}${RoutePaths.chapter}/${props.chapter.id}`}
      class="flex justify-between transition-all p-2 hover:bg-background-muted rounded-lg"
      classList={{
        'opacity-50': props.chapter.isRead,
        'opacity-100': !props.chapter.isRead,
      }}
    >
      <div class="flex flex-col justify-between">
        <span>{props.chapter.name}</span>
        <span>#{props.chapter.sourceOrder}</span>
      </div>
      <div class="flex items-start">
        <div
          class="flex transition-all"
          classList={{
            'opacity-100': isHovered(),
            'opacity-0': !isHovered(),
          }}
        >
          <Button class="hover:opacity-90 icon-18">
            <Show when={!props.chapter.isBookmarked} fallback={<RemoveBookmarkIcon />}>
              <AddBookmarkIcon />
            </Show>
          </Button>
          <Button class="hover:opacity-90 icon-18">
            <Show when={!props.chapter.isRead} fallback={<UnreadIcon />}>
              <ReadIcon />
            </Show>
          </Button>
          <Show when={props.chapter.sourceOrder > 1}>
            <Button class="hover:opacity-90 icon-18">
              <ReadLowerIcon />
            </Button>
          </Show>
          <Button class="hover:opacity-90 icon-18">
            <Show when={!props.chapter.isDownloaded} fallback={<DeleteIcon />}>
              <DownloadIcon />
            </Show>
          </Button>
        </div>
        <div class="flex flex-col">
          <span>{props.chapter.scanlator}</span>
          <span>{new Date(+props.chapter.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
    </A>
  )
}

export default ChapterListItem
