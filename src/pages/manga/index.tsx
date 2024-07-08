import { Component, type JSX, createEffect, createSignal, onMount } from 'solid-js'
import { useGlobalMeta, useGraphQLClient, useHeaderContext } from '@/contexts'
import { getManga } from '@/gql/Queries'
import { useParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { useNotification } from '@/helpers'
import { fetchMangaChapters, fetchMangaInfo } from '@/gql/Mutations'
import { Title } from '@solidjs/meta'
import { ChapterList, MangaInfo } from './components'
import './styles.scss'

const Manga: Component = () => {
  const client = useGraphQLClient()
  const headerCtx = useHeaderContext()
  const params = useParams()

  const { mangaMeta: getMangaMeta } = useGlobalMeta()

  const { mangaMeta } = getMangaMeta(Number(params.id))

  const [metaTitle, setMetaTitle] = createSignal<JSX.Element>()

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
        <div class="flex-1"></div>
        <div class="title__content w-full">
          <MangaInfo manga={mangaData.data} />
          <ChapterList />
        </div>
        <div class="flex-1"></div>
      </div>
    </div>
  )
}

export default Manga
