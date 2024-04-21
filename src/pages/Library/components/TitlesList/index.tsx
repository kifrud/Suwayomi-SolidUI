import { Accessor, Component, For, Show } from 'solid-js'
import { getCategory } from '@/gql'
import TitleCard from './TitleCard'
import './styles.scss'

export type Mangas =
  | ReturnType<NonNullable<typeof getCategory.__apiType>>['category']['mangas']['nodes']
  | undefined

interface TitlesListProps {
  mangas: Accessor<Mangas>
}

const TitlesList: Component<TitlesListProps> = props => {
  return (
    <div class="grid grid-cols-5 gap-2">
      <Show when={props.mangas()}>
        <For each={props.mangas()}>{item => <TitleCard manga={item} />}</For>
      </Show>
    </div>
  )
}

export default TitlesList
