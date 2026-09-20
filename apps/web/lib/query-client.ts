import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute before background revalidation
        staleTime: 60 * 1000,
        // Keep inactive query data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Avoid aggressive window refetching during development and active typing
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Include pending queries during SSR dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Singleton QueryClient getter conforming to Next.js App Router guidelines.
 * - On the server: always creates a new QueryClient per request to avoid data leaking across requests.
 * - In the browser: initializes a single shared instance preserved across client-side re-renders.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
