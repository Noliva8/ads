import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';


// 🔴 Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const { message, locations, path } of graphQLErrors) {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Optionally: redirect to an error page
  }
});

// 🔐 Auth middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('afrofeel_ads_token'); // adjust key if needed

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// 🌐 HTTP connection
const httpLink = createHttpLink({
  uri: import.meta.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
  credentials: 'include'
});

// 🔗 Combine middleware
const link = ApolloLink.from([errorLink, authLink, httpLink]);

// ⚙️ Apollo client instance
const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Campaign: { keyFields: ['id'] },
      Ad: { keyFields: ['id'] }
    }
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
    mutate: { fetchPolicy: 'no-cache' }
  }
});

export default client;
