import { Client } from '@urql/core'
import { ParentComponent, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

const defaultClient = new Client({ url: '/graphql', exchanges: [] })
// FIXME: why the hell i need to creatstore for client
// (otherwise it would stay defaultClient all the time no matter if we pass new value or not)
const [client, setClient] = createStore(defaultClient)

const GraphQLContext = createContext<Client>(client)

export const GraphQLProvider: ParentComponent<{ client: Client }> = ({ client, children }) => {
  setClient(client)
  return <GraphQLContext.Provider value={client}>{children}</GraphQLContext.Provider>
}

export const useGraphQLClient = () => useContext(GraphQLContext)
