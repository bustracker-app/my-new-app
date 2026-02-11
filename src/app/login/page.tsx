'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Authentication Successful',
        description: 'Secure channel established. Welcome back.',
      });
      router.push('/chat');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Please check your credentials and try again.',
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
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary">Baradari.web</CardTitle>
            <CardDescription className="font-code text-muted-foreground">
              Establishing Secure Access...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">Email</FormLabel>
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
                      <FormLabel className="text-primary/80">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full glow-shadow-primary font-headline">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Initiate signup sequence
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
