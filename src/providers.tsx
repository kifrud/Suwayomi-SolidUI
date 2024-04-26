import { ParentComponent } from 'solid-js'
import { AppContextProvider, GraphQLProvider, HeaderContextProvider } from './contexts'
import { client } from './gql/graphqlClient'
import { MetaProvider } from '@solidjs/meta'

const Providers: ParentComponent = props => {
  return (
    <MetaProvider>
      <AppContextProvider>
        <HeaderContextProvider>
          <GraphQLProvider client={client}>{props.children}</GraphQLProvider>
        </HeaderContextProvider>
      </AppContextProvider>
    </MetaProvider>
  )
}

export default Providers
