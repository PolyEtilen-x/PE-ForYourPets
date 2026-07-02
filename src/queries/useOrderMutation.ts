import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  items: OrderItemInput[];
  total: number;
}

export interface PlacedOrderData {
  orderId: string;
  total: number;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  order?: PlacedOrderData;
}

export function useOrderMutation() {
  return useMutation({
    mutationFn: async (orderData: CreateOrderInput): Promise<CreateOrderResponse> => {
      const res = await apiClient.post<CreateOrderResponse>('/order', orderData);
      return res.data;
    },
  });
}
