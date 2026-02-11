'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import NotificationBar from '@/components/notification-bar';
import MessageListener from '@/components/message-listener';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // Effect to handle user online/offline status
  useEffect(() => {
    if (!user || !firestore) return;

    const updateUserStatus = (status: 'online' | 'offline') => {
      const userDocRef = doc(firestore, 'users', user.uid);
      updateDoc(userDocRef, { status }).catch((error) => {
        console.error('Failed to update user status:', error);
      });
    };

    const handleOnline = () => updateUserStatus('online');
    const handleOffline = () => updateUserStatus('offline');
    
    // Set initial status from navigator
    updateUserStatus(navigator.onLine ? 'online' : 'offline');

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set status to offline when the user leaves the page
    // Note: This is not guaranteed to run, especially on mobile browsers.
    const handleBeforeUnload = () => {
        // This update is not guaranteed to complete, but it's a best-effort attempt.
        updateUserStatus('offline');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);


    return () => {
      // Set status to offline when the component unmounts (e.g., user logs out).
      // This is more reliable for in-app navigation than `beforeunload`.
      updateUserStatus('offline');
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, firestore]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background font-code">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <NotificationBar />
      <MessageListener />
      {children}
    </div>
  );
}
