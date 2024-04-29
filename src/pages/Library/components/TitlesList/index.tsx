import { Accessor, Component, For, Show } from 'solid-js'
import { getCategory } from '@/gql/Queries'
import TitleCard from './TitleCard'
import './styles.scss'
import { Skeleton } from '@/components'

export type Mangas =
  | ReturnType<NonNullable<typeof getCategory.__apiType>>['category']['mangas']['nodes']
  | undefined

interface TitlesListProps {
  mangas: Accessor<Mangas> | undefined
}

const TitlesList: Component<TitlesListProps> = props => {
  const placeholder = (
    <For each={new Array(30)}>
      {() => <Skeleton rounded="lg" class="aspect-cover w-full h-full" />}
    </For>
  )
  return (
    <div class="title-list grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-10 gap-2 px-2">
      <Show when={props.mangas!()} fallback={placeholder}>
        <For each={props.mangas!()}>{item => <TitleCard manga={item} />}</For>
      </Show>
    </div>
  )
}

export default TitlesList
