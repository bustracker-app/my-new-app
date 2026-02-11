'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import AppLockAnimation from './components/app-lock-animation';

const formSchema = z.object({
  password: z.string().min(1, { message: 'App Lock Key is required.' }),
});

type UserProfile = {
  appLockPassword?: string | null;
};

export default function AppLockPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!userProfile) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load user profile.' });
      setIsLoading(false);
      return;
    }

    // This is a simulation of encryption. For a real app, use a secure backend method.
    const hashedPassword = btoa(values.password);

    if (hashedPassword === userProfile.appLockPassword) {
      sessionStorage.setItem('app_unlocked', 'true');
      setShowAnimation(true);
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect App Lock Key.' });
      setIsLoading(false);
    }
  }

  const handleAnimationComplete = () => {
    router.replace('/chat');
  };

  if (showAnimation) {
    return <AppLockAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glassmorphism">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">App Locked</CardTitle>
            <CardDescription className="font-code text-muted-foreground">
              Enter your App Lock Key to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">App Lock Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || isProfileLoading} className="w-full glow-shadow-primary font-headline">
                  {isLoading || isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Grant Access'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
