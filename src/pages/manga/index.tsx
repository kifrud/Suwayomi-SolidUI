import {
  Component,
  type JSX,
  createEffect,
  createSignal,
  onMount,
  createMemo,
  Accessor,
  onCleanup,
  Show,
} from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { A, useParams } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { useWindowScrollPosition } from '@solid-primitives/scroll'
import { Button } from '@/components'
import { useAppContext, useGlobalMeta, useGraphQLClient, useHeaderContext } from '@/contexts'
import { getManga } from '@/gql/Queries'
import { matches, useNotification } from '@/helpers'
import { fetchMangaChapters, fetchMangaInfo } from '@/gql/Mutations'
import { ChapterList, MangaInfo, SideInfo } from './components'
import { RoutePaths } from '@/enums'
import { TManga } from '@/types'
import ArrowUp from '~icons/material-symbols/arrow-upward-alt-rounded'
import ArrowLeft from '~icons/material-symbols/arrow-left-alt-rounded'
import UnknownIcon from '~icons/material-symbols/block'
import OngoingIcon from '~icons/material-symbols/schedule-outline'
import CompleteIcon from '~icons/material-symbols/done-all'
import LicenseIcon from '~icons/material-symbols/license'
import PublishingFinishedIcon from '~icons/material-symbols/done'
import CancelledIcon from '~icons/material-symbols/cancel-outline'
import HiatusIcon from '~icons/material-symbols/pause'
import RefreshIcon from '~icons/material-symbols/refresh'
import './styles.scss'
import { ResultOf } from '@/gql'

type MangaStatus = TManga['manga']['status']

export const statusIcons: Accessor<Record<MangaStatus, JSX.Element>> = () => ({
  UNKNOWN: <UnknownIcon />,
  ONGOING: <OngoingIcon />,
  COMPLETED: <CompleteIcon />,
  LICENSED: <LicenseIcon />,
  PUBLISHING_FINISHED: <PublishingFinishedIcon />,
  CANCELLED: <CancelledIcon />,
  ON_HIATUS: <HiatusIcon />,
})

const Manga: Component = () => {
  const { t } = useAppContext()
  const client = useGraphQLClient()
  const headerCtx = useHeaderContext()
  const params = useParams()
  const scroll = useWindowScrollPosition()

  const { mangaMeta: getMangaMeta } = useGlobalMeta()

  const { mangaMeta } = getMangaMeta(Number(params.id))

  const [metaTitle, setMetaTitle] = createSignal<JSX.Element>()

  const sideBtnClasses = createMemo(() =>
    [
      'opacity-30',
      'hover:opacity-80',
      'hover:bg-transparent',
      'flex',
      'w-full',
      'whitespace-nowrap',
    ].join(' ')
  )

  // const mangaData = createQuery(() => ({
  //   queryKey: ['manga', params.id],
  //   queryFn: async () => {
  //     return (
  //       await client.query(getManga, { id: Number(params.id) }, { requestPolicy: 'network-only' })
  //     ).data
  //   },
  //   refetchOnWindowFocus: false,
  // }))

  const [manga, setManga] = createSignal<ResultOf<typeof getManga> | undefined>()

  const { unsubscribe } = client
    .query(getManga, { id: Number(params.id) }, { requestPolicy: 'cache-and-network' })
    .subscribe(res => setManga(res.data))

  const fetchChapters = async () => {
    try {
      await client.mutation(fetchMangaInfo, { id: Number(params.id) })
      await client.mutation(fetchMangaChapters, { id: Number(params.id) })
    } catch (error) {
      useNotification('error', { message: error })
    }
  }

  onMount(() => {
    headerCtx.setHeaderEnd(
      <Button onClick={fetchChapters}>
        <RefreshIcon />
      </Button>
    )
  })

  createEffect(() => {
    setMetaTitle(manga()?.manga.title)
    headerCtx.setHeaderTitle(<h1>{manga()?.manga.title}</h1>)
  })

  createEffect(() => {
    if (manga()?.manga.lastFetchedAt === '0') {
      fetchChapters()
    }
  })

  onCleanup(() => {
    unsubscribe()
    headerCtx.clear()
  })

  return (
    <div class="title">
      {metaTitle() && <Title>{metaTitle()}</Title>}
      <div class="title__banner-wrp">
        <div
          class="title__banner"
          style={{ 'background-image': `url(${manga()?.manga.thumbnailUrl})` }}
        />
        <div class="title__banner-shade" />
      </div>
      <div class="flex w-full">
        <Show when={matches.md}>
          <div class="flex-1">
            <A
              href={RoutePaths.library}
              class={`${sideBtnClasses()} transition-all py-3 px-2 w-full justify-end`}
            >
              <span class="flex items-center">
                <ArrowLeft />
                {t('manga.button.toLibrary')}
              </span>
            </A>
          </div>
        </Show>
        <div class="title__content w-full">
          <Show when={matches.md}>
            <SideInfo manga={manga()} isLoading={!manga()} />
          </Show>
          <div class="flex flex-col w-full gap-2">
            <MangaInfo manga={manga()} isLoading={!manga()} />
            <ChapterList manga={manga()} mangaMeta={mangaMeta} refetch={fetchChapters} />
          </div>
        </div>
        <Show when={matches.md}>
          <div class="flex flex-1 w-full sticky top-[-2px] h-screen justify-end min-w-[142px] transition-all">
            <Show when={scroll.y > 0}>
              <Button class={`${sideBtnClasses()} items-end`} onClick={() => window.scrollTo(0, 0)}>
                <span class="flex items-center">
                  <ArrowUp />
                  {t('manga.button.toDescription')}
                </span>
              </Button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Manga
