import { Accessor, Component, type JSX, Setter, Show, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { CheckBox, Chip, Image, ReadButton } from '@/components'
import { useGlobalMeta } from '@/contexts'
import { Mangas, TLibraryManga } from '@/types'
/* tslint:disable:no-unused-variable */
import { longPress, useHover } from '@/helpers'
import './styles.scss'
import { RoutePaths } from '@/enums'

interface TitleCardProps {
  manga: Accessor<TLibraryManga>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: NonNullable<Mangas>
  updateSelected: SetStoreFunction<NonNullable<Mangas>>
}

type HoverPointerType = 'mouse' | 'pen'

type PointerType = HoverPointerType | 'touch' | 'keyboard' | 'virtual'
// TODO: make options menu
const TitleCard: Component<TitleCardProps> = props => {
  const { globalMeta } = useGlobalMeta()

  const isSelected = createMemo(() =>
    props.selected.map(item => item.id).includes(props.manga().id)
  )

  const [cardRef, setCardRef] = createSignal<HTMLElement>()
  const { isHovered } = useHover(cardRef)

  const cardClasses = createMemo(() =>
    ['title-card', `title-card${isSelected() ? '--selected' : ''}`, 'aspect-cover'].join(' ')
  )

  const handleSelect = () => {
    if (!props.selectMode()) {
      props.updateSelectMode(true)
    }

    if (!isSelected()) {
      return props.updateSelected(prev => [...prev, props.manga()])
    }

    return props.updateSelected(prev => prev.filter(item => item.id !== props.manga().id))
  }

  const handleClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
    if (!props.selectMode()) return

    e.preventDefault()
    e.stopPropagation()
    return handleSelect()
  }

  return (
    <a
      ref={setCardRef}
      href={`/manga/${props.manga().id}`}
      class={cardClasses()}
      onClick={handleClick}
      use:longPress={250}
      on:LongPressStart={() => props.updateSelectMode(true)}
    >
      <div class="relative h-full w-full">
        <div class="absolute flex top-2 left-2 z-30">
          <Show when={globalMeta.downloadsBadge && props.manga().downloadCount > 0}>
            <Chip
              radius="none"
              class={`bg-background w-full h-full ${
                globalMeta.downloadsBadge &&
                globalMeta.unreadsBadge &&
                props.manga().downloadCount > 0 &&
                props.manga().unreadCount > 0
                  ? 'rounded-l'
                  : 'rounded'
              }`}
            >
              {props.manga().downloadCount}
            </Chip>
          </Show>
          <Show when={globalMeta.unreadsBadge && props.manga().unreadCount > 0}>
            <Chip
              radius="none"
              class={`bg-active text-background h-full ${
                globalMeta.unreadsBadge &&
                globalMeta.downloadsBadge &&
                props.manga().unreadCount > 0 &&
                props.manga().downloadCount > 0
                  ? 'rounded-r'
                  : 'rounded'
              }`}
            >
              {props.manga().unreadCount}
            </Chip>
          </Show>
        </div>
        <Show when={props.selectMode() || isHovered()}>
          <div
            class="flex items-center absolute z-40 top-2 right-2"
            onClick={e => {
              e.preventDefault()
              if (props.selectMode()) {
                e.stopPropagation()
              }
            }}
          >
            <CheckBox checked={isSelected()} onChange={handleSelect} />
          </div>
        </Show>
        <Image class="object-cover aspect-cover" src={props.manga().thumbnailUrl ?? ''} alt=" " />
      </div>
      <div class="title-card__footer">
        <p class="text-ellipsis overflow-hidden line-clamp-2 max-h-[3rem]">{props.manga().title}</p>
        <ReadButton
          class="!p-1 relative bottom-auto right-auto"
          hideLabel
          href={`${RoutePaths.manga}/${props.manga()?.id!}${RoutePaths.chapter}/${props.manga()?.lastReadChapter!.id!}`}
          isRead={
            props.manga()?.unreadCount === 0
              ? true
              : props.manga()?.chapters.totalCount === props.manga()?.unreadCount
                ? false
                : undefined
          }
        />
      </div>
    </a>
  )
}

export default TitleCard
