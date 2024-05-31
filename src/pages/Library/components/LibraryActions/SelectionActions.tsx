import { Component, Show, createMemo } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Tooltip } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { enqueueChapterDownloads, updateChapters, updateMangas } from '@/gql/Mutations'
import { ConditionalChaptersOfGivenManga } from '@/gql/Queries'
import { getDownloadable, getDownloaded, getReadMangas, getUnreadMangas } from '@/helpers'
import { Mangas } from '@/types'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import CategoryIcon from '~icons/material-symbols/label-outline'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'

interface SelectionActionsProps {
  selected: NonNullable<Mangas>
  updateSelected: SetStoreFunction<NonNullable<Mangas>>
  refetchCategory: () => void
}
// TODO: download not all but some chapters (if possible)
export const SelectionActions: Component<SelectionActionsProps> = props => {
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const mangaIds = createMemo(() => props.selected.map(item => item.id))
  // FIXME: state doesn't update when action is performed and categories refetched (cuz selected remains the old one)
  const state = createMemo(() => {
    return {
      downloadableMangas: getDownloadable(props.selected),
      downloadedMangas: getDownloaded(props.selected),
      unreadMangas: getUnreadMangas(props.selected),
      readMangas: getReadMangas(props.selected),
    }
  })

  const handleDelete = async () => {
    try {
      const ids = props.selected.map(item => item.id)
      await client.mutation(updateMangas, { ids, inLibrary: false })
      props.refetchCategory()
    } catch (error) {
      console.error(error) // TODO: better error handling
    }
  }

  const handleDownload = async () => {
    try {
      const res = await client
        .query(ConditionalChaptersOfGivenManga, { in: mangaIds(), isDownloaded: false })
        .toPromise()
      if (!res.data) return
      await client
        .mutation(enqueueChapterDownloads, { ids: res.data.chapters.nodes.map(item => item.id) })
        .toPromise()
      props.refetchCategory()
    } catch (error) {
      console.log(error)
    }
  }
  // TODO: delete read chapters feature
  const handleMarkAsRead = async () => {
    try {
      const res = await client
        .query(ConditionalChaptersOfGivenManga, { in: mangaIds(), isRead: false })
        .toPromise()
      if (!res.data) return
      await client.mutation(updateChapters, {
        ids: res.data.chapters.nodes.map(item => item.id),
        isRead: true,
        lastPageRead: 0,
      })
      props.refetchCategory()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkAsUnread = async () => {
    try {
      const res = await client
        .query(ConditionalChaptersOfGivenManga, { in: mangaIds(), isRead: true })
        .toPromise()
      if (!res.data) return
      await client.mutation(updateChapters, {
        ids: res.data.chapters.nodes.map(item => item.id),
        isRead: false,
      })
      props.refetchCategory()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action" onClick={handleDelete}>
            <DeleteIcon />
          </button>
        }
        content={t('library.selection.delete', { count: props.selected.length })}
      />
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action">
            <CategoryIcon />
          </button>
        }
        content={t('library.selection.category')}
      />
      <Show when={!!state().downloadableMangas}>
        <Tooltip
          showArrow
          label={
            <button class="icon-24 transition-all library-action" onClick={handleDownload}>
              <DownloadIcon />
            </button>
          }
          content={t('library.selection.download')}
        />
      </Show>
      <Show when={!!state().unreadMangas.length}>
        <Tooltip
          showArrow
          label={
            <button class="icon-24 transition-all library-action" onClick={handleMarkAsRead}>
              <ReadIcon />
            </button>
          }
          content={t('library.selection.markAsRead', { count: props.selected.length })}
        />
      </Show>
      <Show when={!!state().readMangas.length}>
        <Tooltip
          showArrow
          onClick={handleMarkAsUnread}
          label={
            <button class="icon-24 transition-all library-action">
              <UnreadIcon />
            </button>
          }
          content={t('library.selection.markAsUnread', { count: props.selected.length })}
        />
      </Show>
    </>
  )
}
