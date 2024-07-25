import { Component, For, Show, createMemo } from 'solid-js'
import { useWindowScrollPosition } from '@solid-primitives/scroll'
import { Chip, Skeleton } from '@/components'
import { Dictionary, useAppContext } from '@/contexts'
import { TManga } from '@/types'
import { statusIcons } from '../..'
import ImageView from '../ImageView'
import MangaButtons from '../MangaButtons'
import AuthorIcon from '~icons/material-symbols/person-outline'
import Artisticon from '~icons/material-symbols/brush'
import TagIcon from '~icons/material-symbols/tag'
import './styles.scss'

interface SideInfoProps {
  manga: TManga | undefined
  isLoading: boolean
}

const SideInfo: Component<SideInfoProps> = props => {
  const { t } = useAppContext()

  const scroll = useWindowScrollPosition()

  const personClasses = createMemo(() =>
    ['hover:opacity-100', 'transition-all', 'flex', 'items-center'].join(' ')
  )

  const placeholder = (
    <div class="side-info">
      <Skeleton rounded="lg" class="aspect-cover w-full h-full" />
      <div class="flex flex-col gap-2">
        <Skeleton class="w-full h-8 px-8" rounded="lg"></Skeleton>
        <Skeleton class="w-full h-8 px-8" rounded="lg"></Skeleton>
      </div>
    </div>
  )

  return (
    <Show when={!props.isLoading} fallback={placeholder}>
      <Show when={props.manga?.manga}>
        <div class="side-info">
          <ImageView src={props.manga?.manga.thumbnailUrl} />
          <div class="flex flex-col gap-2">
            <MangaButtons manga={props.manga} />
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
                <div class="flex flex-wrap gap-1 overflow-y-auto lg:overflow-hidden max-h-32 lg:max-h-64 hover:overflow-y-auto">
                  <For each={props.manga?.manga.genre}>
                    {tag => (
                      <Chip class="title__tag !border-0 bg-background-muted py-1">{tag}</Chip>
                    )}
                  </For>
                </div>
              </div>
              <span class={`${personClasses()} justify-center flex flex-col`}>
                <span class={personClasses()}>
                  <Show when={props.manga?.manga.status}>
                    {statusIcons()[props.manga?.manga.status!]}
                  </Show>
                  {t(`manga.status.${props.manga!.manga.status!}` as keyof Dictionary) as string}
                </span>
                <span>•</span>
                <span>{props.manga?.manga.source?.displayName}</span>
              </span>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  )
}

export default SideInfo
