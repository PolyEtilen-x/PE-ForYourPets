import { create } from 'zustand';

export interface TrackingAlert {
  id: string;
  eventType: string;
  message: string;
  timestamp: Date;
}

interface TrackingState {
  alerts: TrackingAlert[];
  addAlert: (eventType: string, message: string) => void;
  removeAlert: (id: string) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  alerts: [],
  addAlert: (eventType, message) =>
    set((state) => {
      const newAlert: TrackingAlert = {
        id: Math.random().toString(),
        eventType,
        message,
        timestamp: new Date(),
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
