'use client';

import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

export default function ChatPage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Logout Successful',
        description: 'You have been securely logged out.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'Could not log you out.',
      });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center text-foreground">
      <h1 className="font-headline text-4xl text-primary">Welcome to Baradari</h1>
      <p className="mt-2 text-muted-foreground">
        Logged in as: <span className="text-primary">{user?.email}</span>
      </p>
      <div className="mt-8">
        <p>Chat interface will be built here.</p>
      </div>
      <Button onClick={handleLogout} variant="destructive" className="mt-8">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
