import { ParentComponent } from 'solid-js'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const Providers: ParentComponent = props => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default Providers
