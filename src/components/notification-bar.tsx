'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { useUser, useFirebaseApp, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission } from '@/lib/fcm';

export default function NotificationBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();
  const firebaseApp = useFirebaseApp();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default' && !sessionStorage.getItem('notification_bar_dismissed')) {
        // Delay showing the bar slightly to not be too intrusive
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You need to be logged in.' });
      return;
    }
    const result = await requestNotificationPermission(user.uid, firestore, firebaseApp);
    if (result === 'granted') {
      toast({ title: 'Success!', description: 'You will now receive notifications.' });
    } else {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'To enable notifications, please update your browser settings.' });
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('notification_bar_dismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 text-secondary-foreground p-3 flex items-center justify-center gap-4 animate-in slide-in-from-top-full duration-500 backdrop-blur-sm">
      <Bell className="h-5 w-5" />
      <p className="text-sm font-medium">Get notified of new messages</p>
      <Button onClick={handleEnable} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
        Enable Notifications
      </Button>
      <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
