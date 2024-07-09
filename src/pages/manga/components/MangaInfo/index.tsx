import { Component, For, Show, createMemo, createSignal } from 'solid-js'
import { Button, Chip } from '@/components'
import { Dictionary, useAppContext } from '@/contexts'
import { TManga } from '@/types'
import ChevronDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import ChevronUp from '~icons/material-symbols/keyboard-arrow-up-rounded'
import AuthorIcon from '~icons/material-symbols/person-outline'
import Artisticon from '~icons/material-symbols/group-outline'
import { statusIcons } from '../..'

interface MangaInfoProps {
  manga: TManga | undefined
  isLoading: boolean
}

const MangaInfo: Component<MangaInfoProps> = props => {
  const { t } = useAppContext()
  const [showDescription, setShowDescription] = createSignal(false)

  const personClasses = createMemo(() =>
    ['opacity-80', 'hover:opacity-100', 'transition-all', 'flex', 'items-center'].join(' ')
  )

  return (
    <Show when={props.manga && !props.isLoading}>
      <div class="title__header">
        <div class="flex flex-col flex-1 gap-2">
          <div class="title__headline-wrp">
            <h1 class="title__headline">{props.manga?.manga.title}</h1>
            <div class="flex flex-col gap-2">
              <div class="flex gap-1 flex-wrap">
                <For each={props.manga?.manga.genre}>
                  {tag => <Chip class="title__tag bg-background-muted-30 py-1">{tag}</Chip>}
                </For>
              </div>
              <span class={personClasses()}>
                <AuthorIcon />
                {props.manga?.manga.author}
              </span>
              <span class={personClasses()}>
                <Artisticon />
                {props.manga?.manga.artist}
              </span>
              <span class={personClasses()}>
                {statusIcons[props.manga?.manga.status!]}
                {
                  t(`manga.status.${props.manga!.manga.status!}` as keyof Dictionary) as string
                } • {props.manga?.manga.source?.displayName}
              </span>
            </div>
          </div>
          <div class="w-full text-xs xs:text-sm md:text-base whitespace-pre-line">
            <p class="overflow-hidden text-ellipsis">
              {/* TODO: animate */}
              <Show
                when={
                  showDescription() ||
                  (props.manga?.manga.description && props.manga?.manga.description.length < 250)
                }
                fallback={props.manga?.manga.description?.substring(0, 250) + '...'}
              >
                {props.manga?.manga.description}
              </Show>
            </p>
            <Show
              when={props.manga?.manga.description && props.manga?.manga.description.length > 250}
            >
              <Button
                class="w-full flex items-center justify-center"
                onClick={() => setShowDescription(prev => !prev)}
              >
                <Show when={showDescription()} fallback={<ChevronDown />}>
                  <ChevronUp />
                </Show>
              </Button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default MangaInfo
