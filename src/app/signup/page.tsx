'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';

const formSchema = z.object({
  nickname: z.string().min(3, { message: 'Nickname must be at least 3 characters.' }).max(50),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Create user profile document in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        nickname: values.nickname,
        username: values.username,
        email: values.email,
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
        title: 'Account Created',
        description: 'Proceed to the final security step.',
      });
      router.push('/set-app-lock');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
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
            <CardTitle className="font-headline text-3xl text-primary">Create New Account</CardTitle>
            <CardDescription className="font-code text-muted-foreground">
              Step 1 of 2: Register your secure identity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">Temporary Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@domain.tld" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">Account Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full glow-shadow-primary font-headline">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Secure Account'}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
