import { Component, For, Show, createMemo, createSignal } from 'solid-js'
import { writeClipboard } from '@solid-primitives/clipboard'
import { Button, Chip, Skeleton } from '@/components'
import { Dictionary, useAppContext } from '@/contexts'
import { useNotification } from '@/helpers'
import { TManga } from '@/types'
import { statusIcons } from '../..'
import ChevronDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import ChevronUp from '~icons/material-symbols/keyboard-arrow-up-rounded'
import AuthorIcon from '~icons/material-symbols/person-outline'
import Artisticon from '~icons/material-symbols/brush'

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
  const descriptionClasses = createMemo(
    () => `overflow-hidden text-ellipsis ${showDescription() ? 'max-h-auto' : 'max-h-[100px]'}`
  )
  const showDescriptionBtnClasses = createMemo(
    () =>
      `w-full flex items-center justify-center ${showDescription() ? '' : 'absolute bottom-0 bg-gradient-to-t title__show-description'}`
  )

  const computeFontSize = (title: string | undefined) => {
    // TODO: there should be a better way
    if (!title) return 'text-base'
    if (title.length <= 10) return 'text-3xl'
    if (title.length <= 20) return 'text-2xl'
    if (title.length <= 30) return 'text-xl'
    return 'text-lg'
  }

  const placeholder = (
    <div class="title__header w-full">
      <div class="flex flex-col flex-1 gap-2 w-full">
        <div class="title__headline-wrp w-full">
          <Skeleton class="title__headline h-6 w-24" />
          <div class="flex flex-col gap-2 w-full">
            <div class="flex gap-1 flex-wrap mt-1">
              <For each={new Array(5)}>{() => <Skeleton class="py-1 h-4 w-24" rounded="md" />}</For>
            </div>
            <Skeleton class="h-3 w-14" />
            <Skeleton class="h-3 w-14" />
            <Skeleton class="h-3 w-14" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Show when={!props.isLoading} fallback={placeholder}>
      <Show when={props.manga?.manga}>
        <div class="title__header">
          <div class="flex flex-col flex-1 gap-2">
            <div class="title__headline-wrp">
              <h1
                class={`title__headline cursor-pointer ${computeFontSize(props.manga?.manga.title)}`}
                on:click={() => {
                  writeClipboard(props.manga?.manga.title!)
                  useNotification('info', { message: 'Copied title' })
                }}
              >
                {props.manga?.manga.title}
              </h1>
              <div class="flex flex-col gap-2">
                <span class={personClasses()}>
                  <AuthorIcon />
                  {props.manga?.manga.author}
                </span>
                <span class={personClasses()}>
                  <Artisticon />
                  {props.manga?.manga.artist}
                </span>
                <span class={personClasses()}>
                  {statusIcons()[props.manga?.manga.status!]}
                  {
                    t(`manga.status.${props.manga!.manga.status!}` as keyof Dictionary) as string
                  } • {props.manga?.manga.source?.displayName}
                </span>
              </div>
            </div>
            <div class="w-full text-xs xs:text-sm md:text-base whitespace-pre-line relative">
              <div class="flex gap-1 flex-wrap">
                <For each={props.manga?.manga.genre}>
                  {tag => (
                    <Chip class="title__tag transition-all bg-background-muted-30">{tag}</Chip>
                  )}
                </For>
              </div>
              <p class={descriptionClasses()}>
                {/* TODO: animate */}
                {props.manga?.manga.description}
              </p>
              <Show
                when={props.manga?.manga.description && props.manga?.manga.description.length > 400}
              >
                <Button
                  class={showDescriptionBtnClasses()}
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
    </Show>
  )
}

export default MangaInfo
