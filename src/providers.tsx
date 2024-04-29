import { ParentComponent } from 'solid-js'
import {
  AppContextProvider,
  GlobalMetaProvider,
  GraphQLProvider,
  HeaderContextProvider,
} from './contexts'
import { client } from './gql/graphqlClient'
import { MetaProvider } from '@solidjs/meta'
import { ThemeProvider } from '@kifrud/solid-theme-provider'
import themes from './themes.json'

const Providers: ParentComponent = props => {
  return (
    <MetaProvider>
      <GlobalMetaProvider>
        <ThemeProvider themes={themes}>
          <AppContextProvider>
            <HeaderContextProvider>
              <GraphQLProvider client={client}>{props.children}</GraphQLProvider>
            </HeaderContextProvider>
          </AppContextProvider>
        </ThemeProvider>
      </GlobalMetaProvider>
    </MetaProvider>
  )
}

export default Providers
