import { ParentComponent } from 'solid-js'
import { GraphQLProvider } from './contexts'
import { client } from './gql/graphqlClient'

const Providers: ParentComponent = ({ children }) => {
  return <GraphQLProvider client={client}>{children}</GraphQLProvider>
}

export default Providers
