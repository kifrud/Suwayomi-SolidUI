import { ParentComponent } from 'solid-js'
import { AppContextProvider, GraphQLProvider } from './contexts'
import { client } from './gql/graphqlClient'
import { ThemeProvider } from 'solid-theme-provider'

const Providers: ParentComponent = props => {
  return (
    <AppContextProvider>
      <GraphQLProvider client={client}>
        {props.children}
        <ThemeProvider styles={{ component: 'hidden' }} />
      </GraphQLProvider>
    </AppContextProvider>
  )
}

export default Providers
