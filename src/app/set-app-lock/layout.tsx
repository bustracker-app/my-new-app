'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function SetAppLockLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background font-code">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground">Verifying secure session...</p>
      </div>
    );
  }

  return <div className="h-screen w-full">{children}</div>;
}
