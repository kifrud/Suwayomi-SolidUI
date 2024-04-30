import { Accessor, Component, For, Show, createMemo } from 'solid-js'
import { getCategory } from '@/gql/Queries'
import TitleCard from './TitleCard'
import { Skeleton } from '@/components'
import InfoIcon from '~icons/material-symbols/info-outline'
import './styles.scss'
import { useAppContext } from '@/contexts'

export type Mangas =
  | ReturnType<NonNullable<typeof getCategory.__apiType>>['category']['mangas']['nodes']
  | undefined

interface TitlesListProps {
  mangas: Accessor<Mangas | undefined>
  isLoading: boolean
}

const TitlesList: Component<TitlesListProps> = props => {
  const { t } = useAppContext()
  const placeholder = (
    <For each={new Array(30)}>
      {() => <Skeleton rounded="lg" class="aspect-cover w-full h-full" />}
    </For>
  )

  const noFoundManga = (
    <div class="h-full w-full flex flex-col items-center justify-center">
      <InfoIcon />
      <span>{t('exceptions.library.emptyCategory')}</span>
    </div>
  )

  const wrapperClasses = createMemo(() =>
    [
      'title-list',
      'grid',
      'h-full',
      !props.isLoading && props.mangas()?.length! === 0 ? '!grid-cols-1' : '',
      'xs:grid-cols-2',
      'sm:grid-cols-3',
      'md:grid-cols-4',
      'lg:grid-cols-5',
      'xl:grid-cols-7',
      '2xl:grid-cols-8',
      '3xl:grid-cols-10',
      'gap-2',
      'px-2',
    ].join(' ')
  )

  return (
    <div class={wrapperClasses()}>
      <Show when={typeof props.mangas() !== 'undefined'} fallback={placeholder}>
        <Show when={props.mangas()?.length! > 0} fallback={noFoundManga}>
          <For each={props.mangas!()}>{item => <TitleCard manga={item} />}</For>
        </Show>
      </Show>
    </div>
  )
}

export default TitlesList
