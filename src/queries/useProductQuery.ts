import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProductQuery(slug?: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const path = slug ? `/products/${slug}` : '/products';
      const res = await apiClient.get(path);
      return res.data;
    },
    staleTime: Infinity, // Product specs are highly static as per rules
  });
}
