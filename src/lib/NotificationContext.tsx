import React, { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';
import { movieService } from '../services/api';

interface Notification {
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const pusher = new Pusher('f8dda6420856102084bc', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('global-notifications');
    channel.bind('notify', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      pusher.unsubscribe('global-notifications');
    };
  }, []);

  // Welcome notification on first login/signup
  useEffect(() => {
    if (user) {
      setNotifications(prev => [{
        title: 'Welcome to Flixvzn!',
        message: `Glad to have you back, ${user.name || user.email}! Start exploring our new movies and series.`,
        timestamp: new Date().toISOString()
      }, ...prev]);
    }
  }, [user]);

  // Periodic notification for trending movies every hour (simulated on frontend for this demo)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const trending = await movieService.getTrending();
        const topMovie = trending[0];
        if (topMovie) {
          setNotifications(prev => [{
            title: '🔥 Trending Now',
            message: `Check out "${topMovie.title}", it's trending this hour!`,
            timestamp: new Date().toISOString()
          }, ...prev]);
        }
      } catch (e) {
        console.error('Failed to fetch trending for notification', e);
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
