import { useMutation } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { apiClient } from '@/lib/api-client';

export function useChatbotMutation() {
  const locale = useLocale();

  return useMutation({
    mutationFn: async (message: string) => {
      const res = await apiClient.post<{ success: boolean; reply: string }>(`/chatbot/ask?locale=${locale}`, { message });
      return res.data.reply;
    },
  });
}
