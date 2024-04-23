import { Component, Show } from 'solid-js'
import { Mangas } from '.'
import { A } from '@solidjs/router'
import { Image } from '@/components'
import './styles.scss'

interface TitleCardProps {
  manga: NonNullable<Mangas>[number]
}

const TitleCard: Component<TitleCardProps> = props => {
  return (
    <A href={`/manga/${props.manga.id}`} class="aspect-cover h-full">
      <div class="title-card">
        <Show when={props.manga.thumbnailUrl} fallback={<span>Failed to load cover</span>}>
          {' '}
          {/* FIXME: doesn't catch errors atm */}
          <div class="relative h-full w-full">
            <Image
              class="object-cover aspect-cover"
              src={props.manga.thumbnailUrl ?? ''}
              alt={props.manga.title}
            />
          </div>
        </Show>
        <div class="title-card__footer">
          <span>{props.manga.title}</span>
        </div>
      </div>
    </A>
  )
}

export default TitleCard
