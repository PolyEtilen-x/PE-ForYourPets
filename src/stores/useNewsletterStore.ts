import { create } from 'zustand';

interface NewsletterState {
  isSubmitted: boolean;
  submittedEmail: string;
  setSubmitted: (email: string) => void;
}

export const useNewsletterStore = create<NewsletterState>((set) => ({
  isSubmitted: false,
  submittedEmail: '',
  setSubmitted: (email: string) => set({ isSubmitted: true, submittedEmail: email }),
}));
