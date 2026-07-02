import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useNewsletterStore } from '@/stores/useNewsletterStore';

export function useNewsletterMutation() {
  const setSubmitted = useNewsletterStore((state) => state.setSubmitted);

  return useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.post('/newsletter/subscribe', { email });
      return res.data;
    },
    onSuccess: (_, email) => {
      setSubmitted(email);
    },
  });
}
