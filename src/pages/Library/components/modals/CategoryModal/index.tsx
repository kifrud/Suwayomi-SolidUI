import { Component, createSignal, createResource, For } from 'solid-js'
import { CheckBox, Modal } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { updateMangasCategories } from '@/gql/Mutations'
import { CategoryTypeFragment } from '@/gql/Fragments'
import { getCategories } from '@/gql/Queries'
import { ResultOf } from '@/gql'
import { useNotification } from '@/helpers'

interface CategoryModalProps {
  onClose?: () => void
  onSubmit?: () => void
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  mangaIds: number[]
}

const CategoryModal: Component<CategoryModalProps> = props => {
  const { t } = useAppContext()
  const client = useGraphQLClient()

  const [selectedCategories, setSelectedCategories] = createSignal<number[]>([])

  const [categories] = createResource(async () => await client.query(getCategories, {}).toPromise())

  const handleClose = (isOpen: boolean) => {
    if (isOpen && props.onClose) props.onClose()
    return props.onOpenChange(isOpen)
  }

  const handleSelect = (checked: boolean, item: ResultOf<typeof CategoryTypeFragment>) => {
    if (checked) return setSelectedCategories(prev => [...prev, item.id])

    const newCategories = selectedCategories().filter(el => el !== item.id)

    setSelectedCategories(newCategories)
  }

  const handleSubmit = async () => {
    props.onOpenChange(false)
    try {
      await client.mutation(updateMangasCategories, {
        ids: props.mangaIds,
        addTo: selectedCategories(),
        clear: true,
      })
    } catch (error) {
      useNotification('error', { message: error as string })
    } finally {
      if (props.onSubmit) props.onSubmit()
    }
  }

  return (
    <Modal
      open={props.open}
      onOpenChange={handleClose}
      classes={{
        description: 'flex flex-col gap-3',
      }}
      title={t('library.modal.edit_category')}
    >
      <div class="flex flex-col gap-2">
        <For each={categories.latest?.data?.categories.nodes}>
          {item => (
            <CheckBox
              label={item.name}
              // checked={false} // TODO: check categories that have mangaIds already
              onChange={checked => handleSelect(checked, item)}
            />
          )}
        </For>
      </div>
      <div class="flex justify-end gap-4">
        <button onClick={() => props.onOpenChange(false)}>{t('global.button.cancel')}</button>
        <button onClick={handleSubmit}>{t('global.button.ok')}</button>
      </div>
    </Modal>
  )
}

export default CategoryModal
