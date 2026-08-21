import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// Constants
const TOKEN_KEY = 'advertizer_id_token';
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:3001/graphql';
const CLIENT_APP = import.meta.env.VITE_CLIENT_APP ?? 'ads';

// Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error] ${message}`, { locations, path });
    });
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'x-afrofeel-client-app': CLIENT_APP,
    },
  };
});

// File Upload Configuration
const uploadLink = createUploadLink({
  uri: GRAPHQL_URI,
  credentials: 'include',
 
});

// Link Composition
const link = ApolloLink.from([
  errorLink,
  authLink,
  uploadLink, // Use uploadLink instead of httpLink
]);

// Client Configuration
const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Campaign: { keyFields: ['id'] },
      Ad: { keyFields: ['id'] },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
    mutate: { fetchPolicy: 'no-cache' },
  },
});

export default client;
