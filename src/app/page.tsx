import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Abu Huraira Institute</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Login</CardTitle>
              <CardDescription>
                Welcome back. Please enter your credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@school.com"
                  required
                  defaultValue="admin@school.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required defaultValue="password" />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://picsum.photos/seed/school-building/1920/1080"
          alt="Abu Huraira Institute"
          data-ai-hint="school building"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute bottom-10 left-10 text-primary-foreground">
            <h2 className="text-4xl font-bold font-headline">Abu Huraira Institute</h2>
            <p className="text-lg mt-2">Excellence in Education, Rooted in Faith.</p>
        </div>
      </div>
    </div>
  );
}
