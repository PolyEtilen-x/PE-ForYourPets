import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface OrderItemInput {
  productId: string;
  productName: string;
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
      // Map frontend fields to backend DTO properties
      const backendPayload = {
        customerName: orderData.name,
        customerPhone: orderData.phone,
        customerEmail: orderData.email,
        shippingAddress: orderData.address,
        paymentMethod: orderData.paymentMethod.toLowerCase() as 'cod' | 'bank_transfer',
        items: orderData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName || 'PE Product',
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await apiClient.post<any>('/orders', backendPayload);
      const backendOrder = res.data;

      return {
        success: true,
        order: {
          orderId: backendOrder.id,
          total: backendOrder.totalAmount,
          paymentMethod: backendOrder.paymentMethod.toUpperCase(),
        },
      };
    },
  });
}
