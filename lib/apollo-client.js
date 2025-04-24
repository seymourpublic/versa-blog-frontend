// lib/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';

export const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql/v1',
    }),
    cache: new InMemoryCache(),
  });
};

export function ApolloWrapper({ children }) {
  const client = createApolloClient();
  
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}