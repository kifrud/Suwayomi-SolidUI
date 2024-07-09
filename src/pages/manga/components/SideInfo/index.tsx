import { Component, For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { useWindowScrollPosition } from '@solid-primitives/scroll'
import { Button, CategoryModal, Chip, Image } from '@/components'
import { Dictionary, useAppContext, useGraphQLClient } from '@/contexts'
import { useNotification } from '@/helpers'
import { updateManga } from '@/gql/Mutations'
import { TManga } from '@/types'
import Favorite from '~icons/material-symbols/favorite'
import FavoriteOutline from '~icons/material-symbols/favorite-outline'
import AuthorIcon from '~icons/material-symbols/person-outline'
import Artisticon from '~icons/material-symbols/group-outline'
import TagIcon from '~icons/material-symbols/tag'
import './styles.scss'
import { statusIcons } from '../..'

interface SideInfoProps {
  manga: TManga | undefined
  isLoading: boolean
}

const SideInfo: Component<SideInfoProps> = props => {
  const { t } = useAppContext()
  const client = useGraphQLClient()

  const scroll = useWindowScrollPosition()

  const [isInLibrary, setIsInLibrary] = createSignal(props.manga?.manga.inLibrary)

  createEffect(() => {
    if (props.manga) setIsInLibrary(props.manga.manga.inLibrary)
  })

  const personClasses = createMemo(() =>
    ['hover:opacity-100', 'transition-all', 'flex', 'items-center'].join(' ')
  )

  const toggleLibraryState = async (submitted?: boolean, selected?: number[]) => {
    const updateLibrary = async () => {
      await client
        .mutation(updateManga, {
          id: props.manga!.manga.id,
          inLibrary: !props.manga?.manga.inLibrary,
          categories: { addToCategories: selected, clearCategories: true },
          updateCategories: true,
        })
        .toPromise()
    }

    try {
      if (!isInLibrary() && !submitted) {
        setOpenCategoryModal(true)
        return
      }

      setIsInLibrary(!isInLibrary())
      await updateLibrary()
    } catch (error) {
      useNotification('error', { message: error })
      // setIsInLibrary(!isInLibrary())
    }
  }
  const [openCategoryModal, setOpenCategoryModal] = createSignal(false)

  return (
    <Show when={!props.isLoading && props.manga}>
      <div class="side-info">
        <CategoryModal
          open={openCategoryModal()}
          onOpenChange={setOpenCategoryModal}
          mangaIds={[props.manga!.manga.id]}
          onSubmit={selected => {
            toggleLibraryState(true, selected)
          }}
        />
        <Image
          src={props.manga!.manga.thumbnailUrl!}
          alt="Cover"
          wrapperClasses="max-w-[200px] relative"
          class="object-cover w-full h-auto max-w-[200px]"
        />
        <div class="flex flex-col gap-2">
          <Button
            class="w-full hover:bg-transparent flex items-center justify-center gap-1"
            classList={{
              'opacity-50 hover:opacity-100': !isInLibrary(),
              'hover:opacity-80': isInLibrary(),
            }}
            onClick={() => toggleLibraryState()}
          >
            <Show
              when={isInLibrary()}
              fallback={
                <>
                  <FavoriteOutline />
                  {t('manga.button.addToLibrary')}
                </>
              }
            >
              <Favorite />
              {t('manga.button.inLibrary')}
            </Show>
          </Button>
          <Button class="w-full py-3" scheme="fill">
            <Show
              when={props.manga?.manga.unreadCount === props.manga?.manga.chapters.totalCount} // TODO: prefetch lastreadchapter
              fallback={t('manga.button.continue')}
            >
              {t('manga.button.read')}
            </Show>
          </Button>
          <div
            class="flex flex-col gap-2 opacity-0 transition"
            classList={{ 'opacity-70': scroll.y > 0 }}
          >
            <span class={personClasses()}>
              <AuthorIcon />
              {props.manga?.manga.author}
            </span>
            <span class={personClasses()}>
              <Artisticon />
              {props.manga?.manga.artist}
            </span>
            <div class="flex flex-col gap-1">
              <span class="flex items-center">
                <TagIcon />
                {t('manga.label.tags')}
              </span>
              <div class="flex flex-wrap gap-1">
                <For each={props.manga?.manga.genre}>
                  {tag => <Chip class="title__tag bg-background-muted py-1">{tag}</Chip>}
                </For>
              </div>
            </div>
            <span class={`${personClasses()} justify-center flex flex-col`}>
              <span class={personClasses()}>
                {statusIcons[props.manga?.manga.status!]}
                {t(`manga.status.${props.manga!.manga.status!}` as keyof Dictionary) as string}
              </span>
              •<span>{props.manga?.manga.source?.displayName}</span>
            </span>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default SideInfo
