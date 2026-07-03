import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useChatbotMutation() {
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await apiClient.post<{ success: boolean; reply: string }>('/chatbot/ask', { message });
      return res.data.reply;
    },
  });
}
