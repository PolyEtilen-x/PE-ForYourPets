import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  orders: {
    total: number;
    delivered: number;
    pending: number;
    revenue: number;
  };
  newsletter: {
    totalSubscribers: number;
  };
  products: {
    totalActive: number;
  };
  tracking: {
    totalEvents: number;
  };
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  specs: Record<string, string[]>;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'bank_transfer';
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  totalAmount: number;
  note?: string;
  createdAt: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface AdminSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export interface SystemLog {
  id: string;
  source: 'FRONTEND' | 'BACKEND' | 'WEBHOOK';
  message: string;
  path?: string;
  payload?: any;
  stack?: string;
  createdAt: string;
}

// 1. Dashboard Stats query
export function useAdminDashboardQuery() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/dashboard');
      return res.data;
    },
    refetchOnWindowFocus: true,
  });
}

// 2. Products query
export function useAdminProductsQuery() {
  return useQuery<AdminProduct[]>({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/products');
      return res.data;
    },
  });
}

// 3. Orders query
export function useAdminOrdersQuery(page = 1, limit = 20) {
  return useQuery<AdminOrder[]>({
    queryKey: ['admin', 'orders', page, limit],
    queryFn: async () => {
      const res = await apiClient.get('/admin/orders', {
        params: { page, limit },
      });
      return res.data;
    },
  });
}

// 4. Newsletters query
export function useAdminNewslettersQuery() {
  return useQuery<AdminSubscriber[]>({
    queryKey: ['admin', 'newsletters'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/newsletters');
      return res.data;
    },
  });
}

// 5. System Logs query
export function useAdminLogsQuery(page = 1, limit = 50) {
  return useQuery<SystemLog[]>({
    queryKey: ['admin', 'logs', page, limit],
    queryFn: async () => {
      const res = await apiClient.get('/admin/system-logs', {
        params: { page, limit },
      });
      return res.data;
    },
  });
}

// Mutations
export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<AdminProduct, 'id' | 'createdAt' | 'isActive'>) => {
      const res = await apiClient.post('/admin/products', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AdminProduct> }) => {
      const res = await apiClient.patch(`/admin/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/admin/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useDeleteSubscriberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/admin/newsletters/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletters'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
