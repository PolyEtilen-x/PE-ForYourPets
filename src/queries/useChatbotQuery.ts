import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { apiClient } from '@/lib/api-client';

export interface ChatbotQuestion {
  id: string;
  question: string;
}

export function useChatbotQuery() {
  const locale = useLocale();

  return useQuery({
    queryKey: ['chatbot', 'questions', locale],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; questions: ChatbotQuestion[] }>(`/chatbot/questions?locale=${locale}`);
      return res.data.questions;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache since FAQs are stable
  });
}
