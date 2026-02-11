'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';

const formSchema = z.object({
  nickname: z.string().min(3, { message: 'Nickname must be at least 3 characters.' }).max(50),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20),
});

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      username: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'User session not found.' });
        return;
    }
    setIsLoading(true);
    try {
      // Create user profile document in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        nickname: values.nickname,
        username: values.username,
        email: user.email,
        profilePhoto: `https://picsum.photos/seed/${values.username}/200`,
        bio: 'New Baradari user.',
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        status: 'online',
        fcmToken: null,
        appLockEnabled: false,
        appLockPassword: null,
      });

      toast({
        title: 'Profile Created',
        description: "Your secure profile has been established.",
      });
      // A new user should set an app lock key
      router.push('/set-app-lock');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Profile Creation Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glassmorphism">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Complete Your Profile</CardTitle>
            <CardDescription className="font-code text-muted-foreground">
              Your account is authenticated, but your profile is incomplete. Please provide a few more details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">Nick Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your_unique_callsign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full glow-shadow-primary font-headline">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Profile'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
