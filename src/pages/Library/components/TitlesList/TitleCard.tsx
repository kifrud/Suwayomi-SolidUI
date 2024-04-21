import { Component, Show } from 'solid-js'
import { Mangas } from '.'
import { A } from '@solidjs/router'
import './styles.scss'

interface TitleCardProps {
  manga: NonNullable<Mangas>[number]
}

const TitleCard: Component<TitleCardProps> = props => {
  return (
    <A href={`/manga/${props.manga.id}`}>
      <div class="title-card">
        <Show when={props.manga.thumbnailUrl} fallback={<span>Failed to load cover</span>}>
          {' '}
          {/* FIXME: doesn't catch errors atm */}
          <img
            class="relative rounded-xl object-cover w-full h-full"
            src={props.manga.thumbnailUrl ?? ''}
            alt={props.manga.title}
          />
        </Show>
        <div class="title-card__footer">
          <span>{props.manga.title}</span>
        </div>
      </div>
    </A>
  )
}

export default TitleCard
