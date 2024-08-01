import { introspection } from './../graphql-env'
import { Client, fetchExchange, subscriptionExchange } from '@urql/core'
import { cacheExchange, type Cache } from '@urql/exchange-graphcache'
import { createClient as createWSClient } from 'graphql-ws'
import { ResultOf, VariablesOf } from './graphql'
import { updateMangas, updateMangasCategories } from './Mutations'
import { getCategories, getCategory, getManga } from './Queries'
import { MangaTypeFragment } from './Fragments'

const wsClient = createWSClient({
  url: window.location.origin.replace(/^http/, 'ws') + '/api/graphql',
})

export const client = new Client({
  url: '/api/graphql',
  exchanges: [
    cacheExchange({
      keys: {
        MangaNodeList: () => null,
        CategoryNodeList: () => null,
        ChapterNodeList: () => null,
        ExtensionNodeList: () => null,
        SourceMetaType: () => null,
        SourceNodeList: () => null,
        SettingsType: () => null,
        GlobalMetaType: () => null,
        GlobalMetaNodeList: () => null,
        MangaMetaType: () => null,
        TrackRecordNodeList: () => null,
        TriStateFilter: () => null,
        TextFilter: () => null,
        ListPreference: () => null,
        SwitchPreference: () => null,
        MultiSelectListPreference: () => null,
        EditTextPreference: () => null,
        CheckBoxPreference: () => null,
        SeparatorFilter: () => null,
        HeaderFilter: () => null,
        SortFilter: () => null,
        SortSelection: () => null,
        CheckBoxFilter: () => null,
        GroupFilter: () => null,
        SelectFilter: () => null,
        SearchTrackerPayload: () => null,
        TrackSearchType: e => e.remoteId!.toString(),
        TrackRecordType: e => e.id!.toString(),
        ExtensionType: e => (e.pkgName as string) + (e.versionName as string) + e.repo,
        TrackStatusType: () => null,
        TrackerNodeList: () => null,
        UpdateStatusCategoryType: () => null,
        UpdateStatusType: () => null,
        UpdateStatus: () => null,
        LastUpdateTimestampPayload: () => null,
      },
      schema: introspection,
      updates: {
        Mutation: {
          updateMangasCategories(result, _, cache, info) {
            const res = result as ResultOf<typeof updateMangasCategories>
            const variables = info.variables as VariablesOf<typeof updateMangasCategories>
            updateMangasCategoriesUpdater(res, variables, cache)
          },
          updateMangas(result, _, cache, info) {
            const res = result as ResultOf<typeof updateMangas>
            const variables = info.variables as VariablesOf<typeof updateMangas>
            updateMangasUpdater(res, variables, cache)
          },
        },
      },
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' }
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink)
            return { unsubscribe }
          },
        }
      },
    }),
  ],
})

function updateMangasCategoriesUpdater(
  data: ResultOf<typeof updateMangasCategories> | undefined,
  variables: VariablesOf<typeof updateMangasCategories>,
  cache: Cache
) {
  if (!variables.addTo || !data) return
  const mangaIds = data.updateMangasCategories.mangas.map(manga => manga.id)
  const defaultCategory = variables.addTo?.length === 0 ? [0] : variables.addTo
  mangaIds.forEach(id => {
    try {
      const oldData = cache.readQuery({
        query: getManga,
        variables: { id },
      })
      if (!oldData) throw new Error()
      const manga = oldData.manga
      manga.categories.nodes =
        variables.addTo?.map(categoryId => ({
          id: categoryId,
        })) ?? manga.categories.nodes
      cache.writeFragment(MangaTypeFragment, manga, {
        id: manga.id,
      })
    } catch (error) {}
  })

  const currentCategoryId = parseInt(new URLSearchParams(window.location.search).get('tab') ?? '0')
  const currentCategoryData = cache.readQuery({
    query: getCategory,
    variables: { id: currentCategoryId },
  })
  if (!currentCategoryData) return
  const mangas = currentCategoryData.category.mangas.nodes.filter(manga =>
    mangaIds.includes(manga.id)
  )

  const categories = cache.readQuery({
    query: getCategories,
  })
  categories?.categories.nodes.forEach(frag => {
    const category = frag
    try {
      const oldCategoryData = cache.readQuery({
        query: getCategory,
        variables: { id: category.id },
      })
      if (!oldCategoryData) return
      if (defaultCategory.includes(category.id)) {
        const mangasToAdd: ResultOf<typeof getCategory>['category']['mangas']['nodes'] = []
        mangas.forEach(manga => {
          if (!oldCategoryData.category.mangas.nodes.find(m => m.id === manga.id)) {
            mangasToAdd.push(manga)
          }
        })
        oldCategoryData.category.mangas.nodes.push(...mangasToAdd)
      } else {
        oldCategoryData.category.mangas.nodes = oldCategoryData.category.mangas.nodes.filter(
          m => !mangaIds.includes(m.id)
        )
      }
      cache.updateQuery(
        {
          query: getCategory,
          variables: { id: category.id },
        },
        oldCategoryData => {
          if (!oldCategoryData) return oldCategoryData
          if (defaultCategory.includes(category.id)) {
            const mangasToAdd: ResultOf<typeof getCategory>['category']['mangas']['nodes'] = []
            mangas.forEach(manga => {
              if (!oldCategoryData.category.mangas.nodes.find(m => m.id === manga.id)) {
                mangasToAdd.push(manga)
              }
            })
            oldCategoryData.category.mangas.nodes.push(...mangasToAdd)
          } else {
            oldCategoryData.category.mangas.nodes = oldCategoryData.category.mangas.nodes.filter(
              m => !mangaIds.includes(m.id)
            )
          }
          return oldCategoryData
        }
      )
    } catch (error) {}
  })
}

function updateMangasUpdater(
  data: ResultOf<typeof updateMangas> | undefined,
  vars: VariablesOf<typeof updateMangas>,
  cache: Cache
) {
  if (!data) return
  data.updateMangas.mangas.forEach(manga => {
    ;(manga.categories.nodes.length ? manga.categories.nodes : [{ id: 0 }]).forEach(category => {
      cache.updateQuery(
        {
          query: getCategory,
          variables: {
            id: category.id,
          },
        },
        categoryData => {
          if (!categoryData) return categoryData
          categoryData.category.mangas.nodes = categoryData.category.mangas.nodes.filter(
            m => !vars.ids.includes(m.id)
          )
          categoryData.category.mangas.nodes.push(
            ...(data.updateMangas.mangas as any)
          )
          return categoryData
        }
      )
    })
  })
}
