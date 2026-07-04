import { apiClient } from './api-client';
import { useTrackingStore } from '@/stores/useTrackingStore';

const TRACKING_API_KEY = process.env.NEXT_PUBLIC_TRACKING_API_KEY || 'pe_secret_key_123';

/**
 * Sends a user behavior tracking event to the NestJS backend webhook
 * and displays a premium micro-interaction alert on screen.
 */
export async function trackEvent(eventType: string, details: Record<string, unknown> = {}) {
  const timestamp = Date.now();
  const cameraId = 'PE-WEB-VISITOR';

  // 1. Send payload to NestJS backend webhook with auth header
  try {
    await apiClient.post(
      '/tracking/event',
      {
        cameraId,
        eventType,
        timestamp,
        details: {
          url: typeof window !== 'undefined' ? window.location.href : '',
          ...details,
        },
      },
      {
        headers: {
          'x-api-key': TRACKING_API_KEY,
        },
      }
    );

    // If successfully saved on the server
    if (process.env.NODE_ENV === 'development') {
      let message = `Đã ghi nhận sự kiện [${eventType}] lên Webhook thành công!`;
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/en')) {
        message = `Tracking event [${eventType}] successfully recorded on Webhook!`;
      }
      useTrackingStore.getState().addAlert(eventType, message, 'success');
    }
  } catch (error: unknown) {
    console.error('Failed to send tracking event to webhook:', error);

    // Extract validation error message from backend if available
    const err = error as {
      message?: string;
      response?: {
        data?: {
          message?: string | string[];
        };
      };
    };

    let errorDetail = '';
    if (err.response?.data?.message) {
      const msg = err.response.data.message;
      errorDetail = Array.isArray(msg) ? msg.join(', ') : msg;
    } else {
      errorDetail = err.message || 'Thất bại';
    }

    if (process.env.NODE_ENV === 'development') {
      let message = `Lỗi Webhook [${eventType}]: ${errorDetail}`;
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/en')) {
        message = `Webhook error [${eventType}]: ${errorDetail}`;
      }
      useTrackingStore.getState().addAlert(eventType, message, 'error');
    }
  }
}
