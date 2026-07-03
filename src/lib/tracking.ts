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

  // UI feedback text depending on language context
  let message = `Đã gửi sự kiện [${eventType}] về Webhook thành công!`;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/en')) {
    message = `Tracking event [${eventType}] sent successfully to Webhook!`;
  }

  // 1. Add visual alert to Zustand store so the user sees it in real-time
  useTrackingStore.getState().addAlert(eventType, message);

  // 2. Send payload to NestJS backend webhook with auth header
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
  } catch (error) {
    console.error('Failed to send tracking event to webhook:', error);
  }
}
