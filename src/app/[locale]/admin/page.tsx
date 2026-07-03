'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';

export default function AdminIndexPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { isAuthenticated } = useAdminAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}/admin/dashboard`);
    } else {
      router.replace(`/${locale}/admin/login`);
    }
  }, [isAuthenticated, locale, router]);

  return null;
}
