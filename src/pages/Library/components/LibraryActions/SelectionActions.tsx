import { Component, createMemo } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Tooltip } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { enqueueChapterDownloads, updateChapters, updateMangas } from '@/gql/Mutations'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import CategoryIcon from '~icons/material-symbols/label-outline'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'
import { ConditionalChaptersOfGivenManga } from '@/gql/Queries'
import { Mangas } from '../..'

interface SelectionActionsProps {
  selected: NonNullable<Mangas>
  updateSelected: SetStoreFunction<NonNullable<Mangas>>
}
// TODO: download not all but some chapters (if possible)
export const SelectionActions: Component<SelectionActionsProps> = props => {
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const mangaIds = createMemo(() => props.selected.map(item => item.id))

  const handleDelete = async () => {
    try {
      const ids = props.selected.map(item => item.id)
      await client.mutation(updateMangas, { ids, inLibrary: false })
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
    } catch (error) {
      console.log(error)
    }
  }
  // TODO: add tooltip contents & translate 'em
  return (
    <>
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action" onClick={handleDelete}>
            <DeleteIcon />
          </button>
        }
      >
        {t('library.selection.delete', { count: props.selected.length })}
      </Tooltip>
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action">
            <CategoryIcon />
          </button>
        }
      ></Tooltip>
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action" onClick={handleDownload}>
            <DownloadIcon />
          </button>
        }
      ></Tooltip>
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all library-action" onClick={handleMarkAsRead}>
            <ReadIcon />
          </button>
        }
      ></Tooltip>
      <Tooltip
        showArrow
        onClick={handleMarkAsUnread}
        label={
          <button class="icon-24 transition-all library-action">
            <UnreadIcon />
          </button>
        }
      ></Tooltip>
    </>
  )
}
