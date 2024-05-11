import { Component, Show } from 'solid-js'
import { Mangas } from '.'
import { A } from '@solidjs/router'
import { Chip, Image } from '@/components'
import './styles.scss'
import { useGlobalMeta } from '@/contexts'

interface TitleCardProps {
  manga: NonNullable<Mangas>[number]
}

const TitleCard: Component<TitleCardProps> = props => {
  const { globalMeta } = useGlobalMeta()

  return (
    <A href={`/manga/${props.manga.id}`} class="aspect-cover h-full">
      <div class="title-card">
        <Show when={props.manga.thumbnailUrl} fallback={<span>Failed to load cover</span>}>
          <div class="relative h-full w-full">
            <div class="absolute flex top-2 left-2 z-30 w-full">
              <Show when={globalMeta.downloadsBadge && props.manga.downloadCount > 0}>
                <Chip
                  radius="none"
                  class={`bg-background w-full h-full ${
                    globalMeta.downloadsBadge &&
                    globalMeta.unreadsBadge &&
                    props.manga.downloadCount > 0 &&
                    props.manga.unreadCount > 0
                      ? 'rounded-l'
                      : 'rounded'
                  }`}
                >
                  {props.manga.downloadCount}
                </Chip>
              </Show>
              <Show when={globalMeta.unreadsBadge && props.manga.unreadCount > 0}>
                <Chip
                  radius="none"
                  class={`bg-active text-background h-full ${
                    globalMeta.unreadsBadge &&
                    globalMeta.downloadsBadge &&
                    props.manga.unreadCount > 0 &&
                    props.manga.downloadCount > 0
                      ? 'rounded-r'
                      : 'rounded'
                  }`}
                >
                  {props.manga.unreadCount}
                </Chip>
              </Show>
            </div>
            <Image class="object-cover aspect-cover" src={props.manga.thumbnailUrl ?? ''} alt=" " />
          </div>
        </Show>
        <div class="title-card__footer">
          <span class="overflow-hidden text-ellipsis">{props.manga.title}</span>
        </div>
      </div>
    </A>
  )
}

export default TitleCard
