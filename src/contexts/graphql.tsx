import { Client } from '@urql/core'
import { ParentComponent, createContext, useContext } from 'solid-js'

const defaultClient = new Client({ url: '/graphql', exchanges: [] })

const GraphQLContext = createContext<Client>(defaultClient)

export const GraphQLProvider: ParentComponent<{ client: Client }> = (props) => {
  return <GraphQLContext.Provider value={props.client}>{props.children}</GraphQLContext.Provider>
}

export const useGraphQLClient = () => useContext(GraphQLContext)
