import { Button, CheckBox, Modal } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { deleteDownloadedChapters, updateMangas } from '@/gql/Mutations'
import { useNotification } from '@/helpers'
import { Mangas } from '@/types'
import { Component, createSignal } from 'solid-js'

interface DeleteModalProps {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  selected: NonNullable<Mangas>
  refetchCategories: () => void
}

const DeleteModal: Component<DeleteModalProps> = props => {
  const { t } = useAppContext()
  const client = useGraphQLClient()

  const [selectedActions, setSelectedActions] = createSignal<string[]>([])

  const handleDeleteFromLibrary = async () => {
    try {
      const ids = props.selected.map(item => item.id)
      await client.mutation(updateMangas, { ids, inLibrary: false })
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  const handleDeleteChapters = async () => {
    try {
      const ids = props.selected.flatMap(item => item.chapters.nodes.map(el => el.id))
      await client.mutation(deleteDownloadedChapters, { ids })
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  const handleActionChange = (action: string, checked: boolean) => {
    setSelectedActions(prev => (checked ? [...prev, action] : prev.filter(item => item !== action)))
  }

  const handleExecuteActions = async () => {
    for (const action of selectedActions()) {
      if (action === 'library') {
        await handleDeleteFromLibrary()
      } else if (action === 'chapters') {
        await handleDeleteChapters()
      }
    }
    props.refetchCategories()
    props.onOpenChange(false)
  }

  return (
    <Modal
      open={props.open}
      onOpenChange={props.onOpenChange}
      title={t('library.modal.delete.title')}
      classes={{
        description: 'flex flex-col gap-3',
      }}
    >
      <div>
        <CheckBox
          onChange={c => handleActionChange('library', c)}
          label={t('library.modal.delete.library')}
        />
        <CheckBox
          onChange={c => handleActionChange('chapters', c)}
          label={t('library.modal.delete.chapters')}
        />
      </div>
      <div class="flex gap-3 items-center justify-end">
        <Button onClick={() => props.onOpenChange(false)} class="hover:opacity-70">
          {t('global.button.cancel')}
        </Button>
        <Button scheme="fill" onClick={handleExecuteActions}>
          {t('global.button.ok')}
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteModal
