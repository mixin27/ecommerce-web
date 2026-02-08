import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { useAuthStore } from '@/store/auth-store';
import { ApolloLink } from '@apollo/client';

const GQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: GQL_URL,
});

const authLink = new SetContextLink((prevContext, _) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((resolve) => resolve());
  pendingRequests = [];
};

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return;
        }

        if (isRefreshing) {
          return new Observable((observer) => {
            pendingRequests.push(() => {
              const token = localStorage.getItem('token');
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${token}`,
                },
              }));
              forward(operation).subscribe(observer);
            });
          });
        }

        isRefreshing = true;

        // Try to refresh the token
        // Use a clean fetch to avoid infinite loops and complexity with the main client
        return new Observable((observer) => {
          fetch(GQL_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({
              query: `
                mutation RefreshToken {
                  refreshToken {
                    accessToken
                    refreshToken
                  }
                }
              `,
            }),
          })
            .then((res) => res.json())
            .then(async (result) => {
              const data = result.data?.refreshToken;
              if (data?.accessToken) {
                useAuthStore
                  .getState()
                  .setTokens(data.accessToken, data.refreshToken);

                // Retry the original operation with the new token
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${data.accessToken}`,
                  },
                }));

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);

                isRefreshing = false;
                resolvePendingRequests();
              } else {
                isRefreshing = false;
                pendingRequests = [];
                useAuthStore.getState().logout();
                observer.error(err);
              }
            })
            .catch((error) => {
              isRefreshing = false;
              pendingRequests = [];
              useAuthStore.getState().logout();
              observer.error(error);
            });
        });
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
