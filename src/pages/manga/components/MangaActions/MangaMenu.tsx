import { Component, createMemo, createSignal } from 'solid-js'
import { writeClipboard } from '@solid-primitives/clipboard'
import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import { Button, CategoryModal } from '@/components'
import { useAppContext } from '@/contexts'
import { TManga } from '@/types'
import MenuIcon from '~icons/material-symbols/more-vert'
import { useNotification } from '@/helpers'

interface MangaMenuProps {
  refresh: () => void
  manga: TManga | undefined
}

const MangaMenu: Component<MangaMenuProps> = props => {
  const { t } = useAppContext()
  const [openCategoryModal, setOpenCategoryModal] = createSignal(false)

  const itemClasses = createMemo(() =>
    ['flex hover:bg-foreground-muted-30 w-full items-start p-2'].join(' ')
  )

  return (
    <>
      <CategoryModal
        open={openCategoryModal()}
        onOpenChange={setOpenCategoryModal}
        mangaIds={[props.manga?.manga.id as number]}
      />
      <DropdownMenu preventScroll={false}>
        <DropdownMenu.Trigger as={Button}>
          <MenuIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content class="manga-menu__content">
            <DropdownMenu.Item as={Button} class={itemClasses()} onClick={props.refresh}>
              {t('manga.actions.refresh')}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              as={Button}
              class={itemClasses()}
              onClick={() => setOpenCategoryModal(true)}
            >
              {t('manga.actions.category')}
            </DropdownMenu.Item>
            <DropdownMenu.Item as={Button} class={itemClasses()} disabled>
              {t('manga.actions.migrate')} {/* TODO */}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              as={Button}
              class={itemClasses()}
              onClick={() => {
                writeClipboard(props.manga?.manga.realUrl as string)
                useNotification('info', { message: 'global.copied' })
              }}
            >
              {t('manga.actions.link')}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </>
  )
}

export default MangaMenu
