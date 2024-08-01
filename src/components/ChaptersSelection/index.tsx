import { Show, createMemo } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import {
  getBookmarkedChapter,
  getDownloadableChapter,
  getDownloadedChapter,
  getReadChapter,
  getUnBookmarkedChapter,
  getUnReadChapter,
  useNotification,
} from '@/helpers'
import { UpdateNode } from '@/pages/Updates'
import { SelectionChapterActions, TChapter } from '@/types'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { deleteDownloadedChapters, enqueueChapterDownloads, updateChapters } from '@/gql/Mutations'
import { Button, Tooltip } from '..'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'
import AddBookmarkIcon from '~icons/material-symbols/bookmark-add-outline'
import RemoveBookmarkIcon from '~icons/material-symbols/bookmark-remove-outline'
import ReadLowerIcon from '~icons/material-symbols/arrow-cool-down'

interface ChaptersActionsProps<T extends UpdateNode | TChapter> {
  chapters?: T[]
  selected: T[]
  updateSelected: SetStoreFunction<T[]>
  disableReadBefore?: boolean
}

const ChaptersActions = <T extends UpdateNode | TChapter>(props: ChaptersActionsProps<T>) => {
  const { t } = useAppContext()
  const client = useGraphQLClient()

  const state = createMemo(() => ({
    downloadableChapters: getDownloadableChapter(props.selected),
    downloadedChapters: getDownloadedChapter(props.selected),
    unbookmarkedChapters: getUnBookmarkedChapter(props.selected),
    bookmarkedChapters: getBookmarkedChapter(props.selected),
    unreadChapters: getUnReadChapter(props.selected),
    readChapters: getReadChapter(props.selected),
  }))

  const handleClick = async (action: SelectionChapterActions) => {
    try {
      switch (action) {
        case 'addBookmark':
          await client
            .mutation(updateChapters, {
              ids: props.selected.map(item => item.id),
              isBookmarked: true,
            })
            .toPromise()
          break

        case 'removeBookmark':
          await client
            .mutation(updateChapters, {
              ids: props.selected.map(item => item.id),
              isBookmarked: false,
            })
            .toPromise()
          break

        case 'markAsRead':
          await client
            .mutation(updateChapters, {
              ids: props.selected.map(item => item.id),
              isRead: true,
            })
            .toPromise()
          break

        case 'markAsReadBefore':
          const index = props.chapters?.findIndex(ch => ch.id === props.selected[0].id)

          await client
            .mutation(updateChapters, {
              ids: props.chapters
                ?.slice(index, props.chapters?.length)
                .map(item => item.id) as number[],
              isRead: true,
            })
            .toPromise()
          break

        case 'markAsUnread':
          await client
            .mutation(updateChapters, {
              ids: props.selected.map(item => item.id),
              isRead: false,
            })
            .toPromise()
          break

        case 'download':
          await client
            .mutation(enqueueChapterDownloads, { ids: props.selected.map(item => item.id) })
            .toPromise()
          break

        case 'delete':
          await client
            .mutation(deleteDownloadedChapters, { ids: props.selected.map(item => item.id) })
            .toPromise()
          break
      }
    } catch (error) {
      useNotification('error', { message: error })
    } finally {
      props.updateSelected([])
    }
  }

  return (
    <>
      <Show when={state().downloadedChapters.length}>
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('delete')}>
              <DeleteIcon />
            </Button>
          }
          content={t('global.selection.delete', { count: state().downloadedChapters.length })}
        />
      </Show>
      <Show
        when={state().unbookmarkedChapters.length}
        fallback={
          <Tooltip
            showArrow
            label={
              <Button onClick={() => handleClick('removeBookmark')}>
                <RemoveBookmarkIcon />
              </Button>
            }
            content={t('global.selection.removeBookmark', {
              count: state().bookmarkedChapters.length,
            })}
          />
        }
      >
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('addBookmark')}>
              <AddBookmarkIcon />
            </Button>
          }
          content={t('global.selection.addBookmark', {
            count: state().unbookmarkedChapters.length,
          })}
        />
      </Show>
      <Show when={state().downloadableChapters.length}>
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('download')}>
              <DownloadIcon />
            </Button>
          }
          content={t('global.selection.download')}
        />
      </Show>
      <Show when={state().unreadChapters.length}>
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('markAsRead')}>
              <ReadIcon />
            </Button>
          }
          content={t('global.selection.markAsRead', { count: state().unreadChapters.length })}
        />
      </Show>
      <Show
        when={
          !props.disableReadBefore &&
          props.selected.length === 1 &&
          props.selected[0].sourceOrder !== 1
        }
      >
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('markAsReadBefore')}>
              <ReadLowerIcon />
            </Button>
          }
          content={t('global.selection.markAsReadBefore')}
        />
      </Show>
      <Show when={state().readChapters.length}>
        <Tooltip
          showArrow
          label={
            <Button onClick={() => handleClick('markAsUnread')}>
              <UnreadIcon />
            </Button>
          }
          content={t('global.selection.markAsUnread', { count: state().readChapters.length })}
        />
      </Show>
    </>
  )
}

export default ChaptersActions
