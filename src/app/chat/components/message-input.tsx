'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirestore } from "@/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  text: z.string().min(1),
});

interface MessageInputProps {
    chatId: string;
    senderId: string;
}

export default function MessageInput({ chatId, senderId }: MessageInputProps) {
    const [isSending, setIsSending] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: "" },
    });
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!firestore) return;
        setIsSending(true);

        const messagesRef = collection(firestore, 'chats', chatId, 'messages');
        const chatRef = doc(firestore, 'chats', chatId);
        
        // Simulate encryption
        const encryptedText = btoa(values.text);

        const messagePayload = {
            senderId: senderId,
            text: values.text, // For UI display
            encryptedText: encryptedText, // For storage
            timestamp: serverTimestamp(),
            seen: false,
            messageId: '', // placeholder
        };

        try {
            // Simulate encryption delay for animation
            await new Promise(resolve => setTimeout(resolve, 750));

            await addDoc(messagesRef, messagePayload);
            await updateDoc(chatRef, {
                lastMessage: values.text,
                lastMessageTime: serverTimestamp()
            });
            form.reset();
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast({
                variant: "destructive",
                title: "Failed to send message",
                description: error.message || "Please check your connection and try again.",
            });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input 
                                    placeholder={isSending ? "Encrypting transmission..." : "Transmit secure message..."}
                                    autoComplete="off"
                                    {...field}
                                    disabled={isSending}
                                    className="bg-background/50 font-mono"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" size="icon" disabled={isSending} className="glow-shadow-primary">
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5"/>}
                </Button>
            </form>
        </Form>
    )
}
