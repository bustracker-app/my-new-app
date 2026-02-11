'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function AppLockLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // We don't show a loader here, because the root page '/' handles the initial loading state.
  // This layout primarily ensures that a non-logged-in user can't access this page directly.
  if (isUserLoading || !user) {
    return null;
  }

  return <div className="h-screen w-full">{children}</div>;
}
