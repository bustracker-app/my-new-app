'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/chat');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background font-code">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-foreground">Initializing secure session...</p>
    </div>
  );
}
