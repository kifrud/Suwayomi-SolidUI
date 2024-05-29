import { initGraphQLTada } from 'gql.tada'
import type { introspection } from '@/graphql-env'

export const graphql = initGraphQLTada<{
  introspection: typeof introspection
  scalars: {
    LongString: string
  }
  disableMasking: true
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
