import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { getIdToken } from './auth'

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

const httpLink = createHttpLink({ uri: `${process.env.API_URL}/graphql` })
const authLink = setContext((_, { headers }) => {
  const token = getIdToken()

  return token
    ? { headers: { ...headers, authorization: `Bearer ${getIdToken()}` } }
    : { headers }
})

const link = authLink.concat(httpLink)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions,
})

export default {}
