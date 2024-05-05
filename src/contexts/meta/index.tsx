import { makePersisted } from '@solid-primitives/storage'
import { ParentComponent, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { GlobalMeta, defaults } from './globalMeta'
import { ResultOf, client } from '@/gql'
import { metas } from '@/gql/Queries'
import { OperationResult } from '@urql/core'
import { deleteGlobalMeta, setGlobalMeta } from '@/gql/Mutations'

interface GlobalMetaState {
  get globalMeta(): GlobalMeta
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

  Meta.subscribe(res => setGlobalMetaStore(extractGlobalMeta({ ...globalMetaStore }, res)))

  const value: GlobalMetaState = {
    get globalMeta() {
      return globalMetaStore
    },
    async set(value: Partial<GlobalMeta>) {
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
