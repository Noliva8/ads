import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { createClient } from 'graphql-ws';




// Constants
const TOKEN_KEY = 'advertizer_id_token';
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:3001/graphql';

const CLIENT_APP = import.meta.env.VITE_CLIENT_APP ?? 'ads';




const getGraphqlWsUri = () => {
  const configuredWsUri =
    import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || import.meta.env.VITE_WS_URL;
  if (configuredWsUri) return configuredWsUri;

  if (/^https?:\/\//.test(GRAPHQL_URI)) {
    return GRAPHQL_URI.replace(/^http/, 'ws');
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const path = GRAPHQL_URI.startsWith('/') ? GRAPHQL_URI : `/${GRAPHQL_URI}`;
    return `${protocol}//${window.location.host}${path}`;
  }

  return GRAPHQL_URI;
};




const GRAPHQL_WS_URI = getGraphqlWsUri();



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

const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_WS_URI,
    connectionParams: () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const authorization = token ? `Bearer ${token}` : '';

      return {
        authorization,
        token,
        authToken: token,
        accessToken: token,
        jwt: token,
        bearerToken: authorization,
        'x-afrofeel-client-app': CLIENT_APP,
        headers: {
          Authorization: authorization,
          authorization,
          token,
          authToken: token,
          accessToken: token,
          jwt: token,
          bearerToken: authorization,
          'x-afrofeel-client-app': CLIENT_APP,
        },
      };
    },
  })
);

const terminatingLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink
);

// Link Composition
const link = ApolloLink.from([
  errorLink,
  authLink,
  terminatingLink,
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
