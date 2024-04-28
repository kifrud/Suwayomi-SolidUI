import { ParentComponent } from 'solid-js'
import {
  AppContextProvider,
  GlobalMetaProvider,
  GraphQLProvider,
  HeaderContextProvider,
} from './contexts'
import { client } from './gql/graphqlClient'
import { MetaProvider } from '@solidjs/meta'

const Providers: ParentComponent = props => {
  return (
    <MetaProvider>
      <GlobalMetaProvider>
        <AppContextProvider>
          <HeaderContextProvider>
            <GraphQLProvider client={client}>{props.children}</GraphQLProvider>
          </HeaderContextProvider>
        </AppContextProvider>
      </GlobalMetaProvider>
    </MetaProvider>
  )
}

export default Providers
