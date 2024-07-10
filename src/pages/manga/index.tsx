import { Component, type JSX, createEffect, createSignal, onMount, createMemo } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { A, useParams } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { Button } from '@/components'
import { useAppContext, useGlobalMeta, useGraphQLClient, useHeaderContext } from '@/contexts'
import { getManga } from '@/gql/Queries'
import { useNotification } from '@/helpers'
import { fetchMangaChapters, fetchMangaInfo } from '@/gql/Mutations'
import { ChapterList, MangaInfo, SideInfo } from './components'
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
import './styles.scss'
import { RoutePaths } from '@/enums'

type MangaStatus = TManga['manga']['status']

export const statusIcons: Record<MangaStatus, JSX.Element> = {
  UNKNOWN: <UnknownIcon />,
  ONGOING: <OngoingIcon />,
  COMPLETED: <CompleteIcon />,
  LICENSED: <LicenseIcon />,
  PUBLISHING_FINISHED: <PublishingFinishedIcon />,
  CANCELLED: <CancelledIcon />,
  ON_HIATUS: <HiatusIcon />,
}

const Manga: Component = () => {
  const { t } = useAppContext()
  const client = useGraphQLClient()
  const headerCtx = useHeaderContext()
  const params = useParams()

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

  const mangaData = createQuery(() => ({
    queryKey: ['manga'],
    queryFn: async () => {
      return (await client.query(getManga, { id: Number(params.id) })).data
    },
    refetchOnWindowFocus: false,
  }))

  const fetchChapters = async () => {
    try {
      await client.mutation(fetchMangaInfo, { id: Number(params.id) })
      await client.mutation(fetchMangaChapters, { id: Number(params.id) })
    } catch (error) {
      useNotification('error', { message: error })
    }
  }

  createEffect(() => {
    setMetaTitle(mangaData.data?.manga.title)
    headerCtx.setHeaderTitle(<h1>{mangaData.data?.manga.title}</h1>)
  })

  onMount(() => {
    if (mangaData.data?.manga.lastFetchedAt === '0') {
      fetchChapters()
    }
  })

  createEffect(() => console.log(mangaData.isFetching))

  return (
    <div class="title">
      {metaTitle() && <Title>{metaTitle()}</Title>}
      <div class="title__banner-wrp">
        <div
          class="title__banner"
          style={{ 'background-image': `url(${mangaData.data?.manga.thumbnailUrl})` }}
        />
        <div class="title__banner-shade" />
      </div>
      <div class="flex w-full">
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
        <div class="title__content w-full">
          <SideInfo manga={mangaData.data} isLoading={mangaData.isFetching} />
          <div class="flex flex-col w-full gap-2">
            <MangaInfo manga={mangaData.data} isLoading={mangaData.isFetching} />
            <ChapterList manga={mangaData.data} mangaMeta={mangaMeta} />
          </div>
        </div>
        <div class="flex flex-1 sticky top-[-2px] h-screen justify-end">
          <Button class={`${sideBtnClasses()} items-end`} onClick={() => window.scrollTo(0, 0)}>
            <span class="flex items-center">
              <ArrowUp />
              {t('manga.button.toDescription')}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Manga
