'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

type UserProfile = {
  isAppLockEnabled: boolean;
};

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    // Don't do anything until we have the auth status
    if (isUserLoading) {
      return;
    }

    // If no user, send to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user exists, but we're waiting for their profile
    if (isProfileLoading) {
      return;
    }
    
    // This can happen for a newly signed up user before the profile is available.
    // The signup flow redirects them to /set-app-lock, so this page won't be hit immediately.
    // If they land here somehow without a profile, login is the safest place to go.
    if (!userProfile) {
        router.replace('/login');
        return;
    }

    // If we have the user and their profile, decide where to go
    if (userProfile.isAppLockEnabled) {
      const isAppUnlocked = sessionStorage.getItem('app_unlocked') === 'true';
      if (!isAppUnlocked) {
        router.replace('/app-lock');
        return;
      }
    }
    
    // If app lock is not enabled, or is already unlocked, go to chat
    router.replace('/chat');

  }, [user, isUserLoading, userProfile, isProfileLoading, router]);


  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background font-code">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-foreground">Initializing secure session...</p>
    </div>
  );
}
