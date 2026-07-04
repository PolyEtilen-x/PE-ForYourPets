import { create } from 'zustand';

export interface TrackingAlert {
  id: string;
  eventType: string;
  message: string;
  timestamp: Date;
  type?: 'success' | 'error';
}

interface TrackingState {
  alerts: TrackingAlert[];
  addAlert: (eventType: string, message: string, type?: 'success' | 'error') => void;
  removeAlert: (id: string) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  alerts: [],
  addAlert: (eventType, message, type = 'success') =>
    set((state) => {
      const newAlert: TrackingAlert = {
        id: Math.random().toString(),
        eventType,
        message,
        timestamp: new Date(),
        type,
      };
      // Keep only the last 3 alerts to prevent clutter
      const currentAlerts = [...state.alerts, newAlert].slice(-3);
      return { alerts: currentAlerts };
    }),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));
