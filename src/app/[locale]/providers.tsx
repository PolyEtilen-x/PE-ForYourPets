'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { useThemeStore } from '@/stores/useThemeStore';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';

// Dynamically load heavy interactive elements with ssr: false
// to keep the initial page bundle size small and fast.
const ChatbotBubble = dynamic(() => import('@/components/sections/chatbot'), {
  ssr: false,
});

const CartDrawer = dynamic(() => import('@/components/ui/cart-drawer'), {
  ssr: false,
});

const WishlistDrawer = dynamic(() => import('@/components/ui/wishlist-drawer'), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((state) => state.isDark);
  
  // Initialize global click and scroll tracking
  useBehaviorTracking();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ChatbotBubble />
      <CartDrawer />
      <WishlistDrawer />
    </QueryClientProvider>
  );
}
