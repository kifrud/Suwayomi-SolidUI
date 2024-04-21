import { ParentComponent } from 'solid-js'
import { AppContextProvider, GraphQLProvider } from './contexts'
import { client } from './gql/graphqlClient'

const Providers: ParentComponent = props => {
  return (
    <AppContextProvider>
      <GraphQLProvider client={client}>
        {props.children}
      </GraphQLProvider>
    </AppContextProvider>
  )
}

export default Providers
