import { ParentComponent } from 'solid-js'
import { AppContextProvider, GraphQLProvider, HeaderContextProvider } from './contexts'
import { client } from './gql/graphqlClient'

const Providers: ParentComponent = props => {
  return (
    <AppContextProvider>
      <HeaderContextProvider>
        <GraphQLProvider client={client}>{props.children}</GraphQLProvider>
      </HeaderContextProvider>
    </AppContextProvider>
  )
}

export default Providers
