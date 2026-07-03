import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ChatbotQuestion {
  id: string;
  question: string;
}

export function useChatbotQuery() {
  return useQuery({
    queryKey: ['chatbot', 'questions'],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; questions: ChatbotQuestion[] }>('/chatbot/questions');
      return res.data.questions;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache since FAQs are stable
  });
}
