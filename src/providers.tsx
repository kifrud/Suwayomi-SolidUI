import { ParentComponent } from 'solid-js'
import { AppContextProvider, GraphQLProvider } from './contexts'
import { client } from './gql/graphqlClient'
import { ThemeProvider } from 'solid-theme-provider'
import themes from './themes.json'

const Providers: ParentComponent = props => {
  return (
    <AppContextProvider>
      <GraphQLProvider client={client}>
        {props.children}
        <ThemeProvider styles={{ component: 'hidden' }} themes={themes} />
      </GraphQLProvider>
    </AppContextProvider>
  )
}

export default Providers
