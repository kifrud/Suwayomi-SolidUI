import { Component, For, Show, createEffect, createSignal } from 'solid-js'
import { Button, CategoryModal, Chip, Image } from '@/components'
import { TManga } from '@/types'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { useNotification } from '@/helpers'
import { updateManga } from '@/gql/Mutations'
import Favorite from '~icons/material-symbols/favorite'
import FavoriteOutline from '~icons/material-symbols/favorite-outline'

interface MangaInfoProps {
  manga: TManga | undefined
}

const MangaInfo: Component<MangaInfoProps> = props => {
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const [isInLibrary, setIsInLibrary] = createSignal(props.manga?.manga.inLibrary)
  const [openCategoryModal, setOpenCategoryModal] = createSignal(false)

  createEffect(() => {
    if (props.manga) {
      setIsInLibrary(props.manga.manga.inLibrary)
    }
  })

  const toggleLibraryState = async (selected?: number[]) => {
    try {
      if (!isInLibrary()) setOpenCategoryModal(true)
      setIsInLibrary(prev => !prev)
      await client
        .mutation(updateManga, {
          id: props.manga!.manga.id,
          inLibrary: !props.manga?.manga.inLibrary,
          categories: { addToCategories: selected, clearCategories: true },
          updateCategories: true,
        })
        .toPromise()
    } catch (error) {
      useNotification('error', { message: error })
    }
  }

  createEffect(() => console.log(props.manga?.manga.inLibrary))

  return (
    <Show when={props.manga}>
      <CategoryModal
        open={openCategoryModal()}
        onOpenChange={setOpenCategoryModal}
        mangaIds={[props.manga!.manga.id]}
        onSubmit={selected => toggleLibraryState(selected)}
      />
      <div class="title__header">
        <div class="flex flex-col gap-4">
          <Show when={props.manga?.manga.thumbnailUrl}>
            <Image
              src={props.manga!.manga.thumbnailUrl!}
              alt="Cover"
              wrapperClasses="max-w-[200px] relative"
              class="object-cover w-full h-auto max-w-[200px]"
            />
          </Show>
          <div class="flex flex-col gap-2">
            <Button class="w-full py-3" scheme="fill">
              Read
            </Button>
            <Button
              class="w-full hover:bg-transparent flex items-center gap-1"
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
                    {t('manga.addToLibrary')}
                  </>
                }
              >
                <Favorite />
                {t('manga.removeFromLibrary')}
              </Show>
            </Button>
          </div>
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <div class="title__headline-wrp">
            <h1 class="title__headline">{props.manga?.manga.title}</h1>
            <div class="flex gap-1 flex-wrap">
              <For each={props.manga?.manga.genre}>{item => <Chip>{item}</Chip>}</For>
            </div>
          </div>
        </div>
      </div>
      {/* <Description manga={title.data}>
        <TitleTags manga={title.data} class="flex md:hidden" />
      </Description> */}
    </Show>
  )
}

export default MangaInfo
