import { makePersisted } from '@solid-primitives/storage'
import { ParentComponent, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ResultOf, client } from '@/gql'
import { getManga, metas } from '@/gql/Queries'
import { OperationResult } from '@urql/core'
import { deleteGlobalMeta, deleteMangaMeta, setGlobalMeta, setMangaMeta } from '@/gql/Mutations'
import { GlobalMeta, MangaMeta, defaults } from './defaults'

interface GlobalMetaState {
  get globalMeta(): GlobalMeta
  mangaMeta(id: number): {
    mangaMeta: MangaMeta
    set: (value: Partial<MangaMeta>) => void
  }
  set(value: Partial<GlobalMeta>): void
}

export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function getObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

const GlobalMetaContext = createContext<GlobalMetaState>({} as GlobalMetaState)

export const useGlobalMeta = () => useContext(GlobalMetaContext)

export const GlobalMetaProvider: ParentComponent = props => {
  const Meta = client.query(metas, {})

  const [globalMetaStore, setGlobalMetaStore] = makePersisted(createStore(defaults), {
    name: 'globalMeta',
  })

  const [mangaMetaStore, setMangaMetaStore] = makePersisted(
    createStore(globalMetaStore.mangaMetaDefaults),
    { name: 'mangaMeta' }
  )

  function extractGlobalMeta(
    value: GlobalMeta,
    queryResult: OperationResult<ResultOf<typeof metas>>
  ): GlobalMeta {
    const globalMetaCopy = { ...globalMetaStore } as GlobalMeta
    const metas = queryResult.data?.metas?.nodes || []
    getObjectKeys(value).forEach(<T extends keyof GlobalMeta>(key: T) => {
      const foundMeta = metas.find(node => node.key.replace('SolidUI_', '') === key)
      if (foundMeta) {
        globalMetaCopy[key] = JSON.parse(foundMeta.value) as GlobalMeta[T]
      }
    })
    return globalMetaCopy
  }

  function extractMangaMeta(
    newMeta: MangaMeta,
    queryResult: OperationResult<ResultOf<typeof getManga>>
  ): MangaMeta {
    const clonedStore = { ...globalMetaStore.mangaMetaDefaults } as MangaMeta
    const metas = queryResult.data?.manga.meta || []
    getObjectKeys(newMeta).forEach(<T extends keyof MangaMeta>(key: T) => {
      const matchedMeta = metas.find(meta => meta.key.replace('SolidUI_', '') === key)
      if (!matchedMeta) return
      clonedStore[key] = JSON.parse(matchedMeta.value) as MangaMeta[T]
    })
    return clonedStore
  }

  Meta.subscribe(res => setGlobalMetaStore(extractGlobalMeta({ ...globalMetaStore }, res)))

  const value: GlobalMetaState = {
    get globalMeta() {
      return globalMetaStore
    },
    mangaMeta(id) {
      const MMeta = client.query(getManga, { id })

      MMeta.subscribe(res => setMangaMetaStore(extractMangaMeta({ ...mangaMetaStore }, res)))

      async function set(value: Partial<MangaMeta>) {
        for (const [key, val] of getObjectEntries(value)) {
          const jsonValue = JSON.stringify(val)
          const cacheKey = `SolidUI_${key}`
          const cachedValue = (await MMeta).data?.manga?.meta.find(e => e.key === cacheKey)?.value

          if (jsonValue !== cachedValue) {
            try {
              setMangaMetaStore(prev => ({ ...prev, [key]: val }))

              const variables = { key: cacheKey, value: jsonValue, id }
              if (val !== globalMetaStore.mangaMetaDefaults[key]) {
                await client.mutation(setMangaMeta, variables)
              } else if (cachedValue !== undefined) {
                await client.mutation(deleteMangaMeta, variables)
              }
            } catch (e) {
              throw e
            }
          }
        }
      }

      return {
        mangaMeta: mangaMetaStore,
        set,
      }
    },
    async set(value) {
      for (const [key, val] of getObjectEntries(value)) {
        const stringVal = JSON.stringify(val)
        const metaKey = `SolidUI_${key}`
        const existingVal = (await Meta.toPromise()).data?.metas.nodes.find(
          e => e.key === metaKey
        )?.value

        if (stringVal !== existingVal) {
          try {
            setGlobalMetaStore(prev => ({ ...prev, [key]: val }))

            const vars = { key: metaKey, value: stringVal }

            if (stringVal !== JSON.stringify(defaults[key])) {
              await client.mutation(setGlobalMeta, vars).toPromise()
            } else if (existingVal !== undefined) {
              await client.mutation(deleteGlobalMeta, vars).toPromise()
            }
          } catch (e) {
            throw e
          }
        }
      }
    },
  }

  return <GlobalMetaContext.Provider value={value}>{props.children}</GlobalMetaContext.Provider>
}

export { type GlobalMeta, type MangaMeta } from './defaults'
