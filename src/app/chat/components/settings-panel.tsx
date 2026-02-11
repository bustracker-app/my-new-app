'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Save } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }).optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
  newAppLockKey: z.string().min(4, { message: 'App Lock Key must be at least 4 characters.' }).optional().or(z.literal('')),
  confirmNewAppLockKey: z.string().optional().or(z.literal('')),
})
.refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
})
.refine(data => data.newAppLockKey === data.confirmNewAppLockKey, {
  message: "App Lock Keys don't match",
  path: ['confirmNewAppLockKey'],
})
.refine(data => {
  const isChangingPassword = !!data.newPassword;
  const isChangingEmail = !!data.email;
  if (isChangingPassword || isChangingEmail) {
    return !!data.currentPassword;
  }
  return true;
}, {
  message: 'Current password is required to change email or password.',
  path: ['currentPassword'],
});


interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SettingsPanel({ isOpen, onClose, onSave }: SettingsPanelProps) {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showNewAppLock, setShowNewAppLock] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      newAppLockKey: '',
      confirmNewAppLockKey: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to change settings.' });
      return;
    }
    
    setIsSaving(true);
    let changesMade = false;

    try {
        // Re-authentication if needed
        if ((values.email && values.email !== user.email) || values.newPassword) {
            if (!values.currentPassword) {
                form.setError('currentPassword', { message: 'Current password is required.' });
                setIsSaving(false);
                return;
            }
            const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
        }

        // Update Email
        if (values.email && values.email !== user.email) {
            await updateEmail(auth.currentUser, values.email);
            changesMade = true;
            toast({ title: 'Email Updated' });
        }

        // Update Password
        if (values.newPassword) {
            await updatePassword(auth.currentUser, values.newPassword);
            changesMade = true;
            toast({ title: 'Password Updated' });
        }
        
        const userDocRef = doc(firestore, 'users', user.uid);

        // Update App Lock Key
        if (values.newAppLockKey) {
            const hashedAppLockKey = btoa(values.newAppLockKey);
            await updateDoc(userDocRef, { appLockPassword: hashedAppLockKey });
            changesMade = true;
            toast({ title: 'App Lock Key Updated' });
        }
        
        // Update timestamp if any change was made
        if(changesMade) {
            await updateDoc(userDocRef, { lastSeen: serverTimestamp() });
        }

        if (changesMade) {
            onSave();
        } else {
            toast({ description: "No changes were made." });
            onClose();
        }

    } catch (error: any) {
        console.error("Error updating settings:", error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsSaving(false);
        form.reset({
            email: values.email || user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            newAppLockKey: '',
            confirmNewAppLockKey: ''
        });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="glassmorphism w-[calc(100vw-40px)] max-w-md p-4 sm:p-6 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-headline text-2xl text-primary">Secure Account Settings</SheetTitle>
          <SheetDescription>
            Manage your credentials. Changes require your current password.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="user@domain.tld" className="focus-glow-green" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 rounded-md border border-input p-3">
              <h4 className="text-sm font-medium text-primary/90">Password & Security</h4>
              <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Account Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input {...field} type={showCurrentPass ? 'text' : 'password'} placeholder="Required to make changes" className="focus-glow-green pr-10" />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrentPass(p => !p)}>
                                {showCurrentPass ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Account Password</FormLabel>
                     <FormControl>
                        <div className="relative">
                            <Input {...field} type={showNewPass ? 'text' : 'password'} placeholder="Leave blank to keep current" className="focus-glow-green pr-10" />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNewPass(p => !p)}>
                                {showNewPass ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl><Input {...field} type={showNewPass ? 'text' : 'password'} placeholder="Confirm new password" className="focus-glow-green" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newAppLockKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New App Lock Key</FormLabel>
                     <FormControl>
                        <div className="relative">
                            <Input {...field} type={showNewAppLock ? 'text' : 'password'} placeholder="Leave blank to keep current" className="focus-glow-green pr-10" />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNewAppLock(p => !p)}>
                                {showNewAppLock ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewAppLockKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New App Lock Key</FormLabel>
                    <FormControl><Input {...field} type={showNewAppLock ? 'text' : 'password'} placeholder="Confirm new key" className="focus-glow-green" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSaving} className="w-full font-headline glow-shadow-primary">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Changes
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
