import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProductQuery(slug?: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const path = slug ? `/products/${slug}` : '/products';
      const res = await apiClient.get(path);
      const data = res.data;

      // Map backend `images` (array) to frontend `image` (string)
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          ...item,
          image: item.images?.[0] || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop&q=80',
        }));
      } else if (data) {
        return {
          ...data,
          image: data.images?.[0] || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop&q=80',
        };
      }
      return data;
    },
    staleTime: Infinity, // Product specs are highly static as per rules
  });
}
