import { Component, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { Progress } from '@kobalte/core/progress'
import { Button, CategoryModal } from '@/components'
import { useAppContext, useGraphQLClient } from '@/contexts'
import { updateManga } from '@/gql/Mutations'
import { useNotification } from '@/helpers'
import { RoutePaths } from '@/enums'
import { TManga } from '@/types'
import Favorite from '~icons/material-symbols/favorite'
import FavoriteOutline from '~icons/material-symbols/favorite-outline'
import SourceIcon from '~icons/material-symbols/public'
import TrackIcon from '~icons/material-symbols/sync'
import './styles.scss'

interface MangaButtonsProps {
  manga: TManga | undefined
  hideReadBtn?: boolean
  class?: string
}

const MangaButtons: Component<MangaButtonsProps> = props => {
  const client = useGraphQLClient()
  const { t } = useAppContext()

  const [openCategoryModal, setOpenCategoryModal] = createSignal(false)
  const [isInLibrary, setIsInLibrary] = createSignal(props.manga?.manga.inLibrary)

  const btnClasses = createMemo(() =>
    [
      'w-full',
      'hover:bg-transparent',
      'flex',
      'items-center',
      'justify-center',
      'gap-1',
      ...(props.class ? [props.class] : []),
    ].join(' ')
  )

  createEffect(() => {
    if (props.manga) setIsInLibrary(props.manga.manga.inLibrary)
  })

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

  return (
    <>
      <CategoryModal
        open={openCategoryModal()}
        onOpenChange={setOpenCategoryModal}
        mangaIds={[props.manga!.manga.id]}
        onSubmit={selected => toggleLibraryState(true, selected)}
      />
      <Button
        class={btnClasses()}
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
      <Button class={btnClasses()} disabled>
        <TrackIcon />
        {t('manga.button.track')}
      </Button>
      <A
        href={props.manga?.manga.realUrl!}
        class={`${btnClasses()} icon-24 hover:opacity-80 p-1 transition-all`}
      >
        <SourceIcon />
        {t('manga.button.openSource')}
      </A>
      <Show when={!props.hideReadBtn}>
        <A
          href={`${RoutePaths.manga}/${props.manga?.manga.id!}${RoutePaths.chapter}/${props.manga?.manga.lastReadChapter!.id!}`}
          class="flex flex-col items-center justify-center relative w-full py-1 hover:opacity-75 text-background px-0 transition-all"
        >
          <Show
            when={props.manga?.manga.unreadCount === props.manga?.manga.chapters.totalCount}
            fallback={
              <>
                {t('global.button.continue')}
                <p class="text-background text-xs opacity-65 leading-0">
                  {props.manga?.manga.chapters.totalCount! - props.manga?.manga.unreadCount!} /{' '}
                  {/* FIXME: not updating when some chateprs marked as read */}
                  {props.manga?.manga.chapters.totalCount!}
                </p>
                <Show
                  when={
                    props.manga?.manga.unreadCount !== undefined &&
                    props.manga?.manga.chapters.totalCount !== undefined
                  }
                >
                  <Progress
                    value={
                      (100 *
                        (props.manga?.manga.chapters.totalCount! -
                          props.manga?.manga.unreadCount!)) /
                      props.manga?.manga.chapters.totalCount!
                    }
                  >
                    <Progress.Track class="w-full bg-foreground-60 h-full rounded-lg absolute z-[-1] bottom-0 left-0">
                      <Progress.Fill class="mbuttons__read-progress h-full rounded-lg" />
                    </Progress.Track>
                  </Progress>
                </Show>
              </>
            }
          >
            {t('global.button.read')}
          </Show>
        </A>
      </Show>
    </>
  )
}

export default MangaButtons
