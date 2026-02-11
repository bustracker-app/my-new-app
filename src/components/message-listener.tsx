'use client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseApp } from '@/firebase';
import { setupForegroundMessageListener } from '@/lib/fcm';

export default function MessageListener() {
    const { toast } = useToast();
    const firebaseApp = useFirebaseApp();

    useEffect(() => {
        if (typeof window !== 'undefined' && firebaseApp) {
            setupForegroundMessageListener(firebaseApp, (payload) => {
                toast({
                    title: payload.notification?.title || "New Message",
                    description: payload.notification?.body,
                });
            });
        }
    }, [toast, firebaseApp]);

    return null;
}
