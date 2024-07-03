import { Component, Show, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Tooltip } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { enqueueChapterDownloads, updateChapters } from '@/gql/Mutations'
import { ConditionalChaptersOfGivenManga } from '@/gql/Queries'
import {
  getDownloadable,
  getDownloaded,
  getReadMangas,
  getUnreadMangas,
  useNotification,
} from '@/helpers'
import { LibraryActions, Mangas } from '@/types'
import { CategoryModal, DeleteModal } from '../modals'
import DeleteIcon from '~icons/material-symbols/delete-forever'
import CategoryIcon from '~icons/material-symbols/label-outline'
import DownloadIcon from '~icons/material-symbols/download-2'
import ReadIcon from '~icons/material-symbols/done-all'
import UnreadIcon from '~icons/material-symbols/remove-done'

interface SelectionActionsProps {
  selected: NonNullable<Mangas>
  updateSelected: SetStoreFunction<NonNullable<Mangas>>
  refetchCategory: () => void
  refetchCategories: () => void
}

export const SelectionActions: Component<SelectionActionsProps> = props => {
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const [openCategoryModal, setOpenCategoryModal] = createSignal(false)
  const [openDeleteModal, setOpenDeleteModal] = createSignal(false)

  const mangaIds = createMemo(() => props.selected.map(item => item.id))

  const state = createMemo(() => {
    return {
      downloadableMangas: getDownloadable(props.selected),
      downloadedMangas: getDownloaded(props.selected),
      unreadMangas: getUnreadMangas(props.selected),
      readMangas: getReadMangas(props.selected),
    }
  })
  // TODO: download not all but some chapters & delete read chapters
  const handleClick = async (
    // e: MouseEvent & {
    //   currentTarget: HTMLButtonElement
    //   target: Element
    // },
    action: LibraryActions
  ) => {
    switch (action) {
      case 'download':
        try {
          const res = await client
            .query(ConditionalChaptersOfGivenManga, { in: mangaIds(), isDownloaded: false })
            .toPromise()
          if (!res.data) return
          await client
            .mutation(enqueueChapterDownloads, {
              ids: res.data.chapters.nodes.map(item => item.id),
            })
            .toPromise()
          props.refetchCategory()
        } catch (error) {
          useNotification('error', { message: error as string })
        }
        break

      case 'delete':
        setOpenDeleteModal(true)
        break

      case 'editCategory':
        setOpenCategoryModal(true)
        break

      case 'markAsRead':
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
          useNotification('error', { message: error as string })
        }
        break

      case 'markAsUnread':
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
          useNotification('error', { message: error as string })
        }
        break
    }
  }

  return (
    <>
      <CategoryModal
        open={openCategoryModal()}
        onOpenChange={setOpenCategoryModal}
        mangaIds={props.selected.map(item => item.id)}
        onSubmit={props.refetchCategories}
      />
      <DeleteModal
        open={openDeleteModal()}
        onOpenChange={setOpenDeleteModal}
        selected={props.selected}
        refetchCategories={props.refetchCategories}
      />
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all action" onClick={() => handleClick('delete')}>
            <DeleteIcon />
          </button>
        }
        content={t('library.selection.delete', { count: props.selected.length })}
      />
      <Tooltip
        showArrow
        label={
          <button class="icon-24 transition-all action" onClick={() => handleClick('editCategory')}>
            <CategoryIcon />
          </button>
        }
        content={t('library.selection.category')}
      />
      <Show when={!!state().downloadableMangas}>
        <Tooltip
          showArrow
          label={
            <button class="icon-24 transition-all action" onClick={() => handleClick('download')}>
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
            <button class="icon-24 transition-all action" onClick={() => handleClick('markAsRead')}>
              <ReadIcon />
            </button>
          }
          content={t('library.selection.markAsRead', { count: props.selected.length })}
        />
      </Show>
      <Show when={!!state().readMangas.length}>
        <Tooltip
          showArrow
          onClick={() => handleClick('markAsUnread')}
          label={
            <button class="icon-24 transition-all action">
              <UnreadIcon />
            </button>
          }
          content={t('library.selection.markAsUnread', { count: props.selected.length })}
        />
      </Show>
    </>
  )
}
