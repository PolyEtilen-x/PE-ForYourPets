import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute default staleTime
      refetchOnWindowFocus: false, // Disable by default as per rule overrides
      retry: 1,
    },
  },
});
