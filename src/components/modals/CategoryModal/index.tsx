import { Component, createSignal, createResource, For } from 'solid-js'
import { Button, CheckBox, Modal } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { updateMangasCategories } from '@/gql/Mutations'
import { CategoryTypeFragment } from '@/gql/Fragments'
import { getCategories } from '@/gql/Queries'
import { ResultOf } from '@/gql'
import { useNotification } from '@/helpers'

interface CategoryModalProps {
  onClose?: () => void
  onSubmit?: (selected: number[]) => void
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
      if (props.onSubmit) props.onSubmit(selectedCategories())
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
              defaultChecked={item.mangas.nodes.some(manga => props.mangaIds.includes(manga.id))}
              onChange={checked => handleSelect(checked, item)}
            />
          )}
        </For>
      </div>
      <div class="flex justify-end gap-4">
        <Button onClick={() => props.onOpenChange(false)} class="hover:opacity-70">
          {t('global.button.cancel')}
        </Button>
        <Button scheme="fill" onClick={handleSubmit}>
          {t('global.button.ok')}
        </Button>
      </div>
    </Modal>
  )
}

export default CategoryModal
