"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculateBusEta } from '@/ai/flows/live-bus-tracking-eta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, Milestone } from 'lucide-react';

const formSchema = z.object({
    busLocationLatitude: z.coerce.number().min(-90).max(90),
    busLocationLongitude: z.coerce.number().min(-180).max(180),
    busSpeed: z.coerce.number().min(0),
    stopLatitude: z.coerce.number().min(-90).max(90),
    stopLongitude: z.coerce.number().min(-180).max(180),
    routeName: z.string().min(1, "Route name is required."),
});

type EtaResult = {
    etaMinutes: number;
    distanceKm: number;
};

export default function EtaForm() {
    const [etaResult, setEtaResult] = useState<EtaResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            busLocationLatitude: 25.1972,
            busLocationLongitude: 55.2744,
            busSpeed: 45,
            stopLatitude: 25.2048,
            stopLongitude: 55.2708,
            routeName: 'Route A',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setEtaResult(null);
        try {
            const result = await calculateBusEta(values);
            setEtaResult(result);
        } catch (error) {
            console.error("Error calculating ETA:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to calculate ETA. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">ETA Prediction</CardTitle>
                <CardDescription>
                    Calculate the estimated time of arrival using AI.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="busLocationLatitude" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bus Latitude</FormLabel>
                                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="busLocationLongitude" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bus Longitude</FormLabel>
                                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="busSpeed" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bus Speed (km/h)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField control={form.control} name="stopLatitude" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stop Latitude</FormLabel>
                                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="stopLongitude" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stop Longitude</FormLabel>
                                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="routeName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Route Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Calculate ETA
                        </Button>
                    </form>
                </Form>

                {etaResult && (
                    <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold font-headline">Calculation Result</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="bg-secondary/50">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">ETA</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {etaResult.etaMinutes} min
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Estimated time of arrival
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-secondary/50">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Distance</CardTitle>
                                    <Milestone className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {etaResult.distanceKm.toFixed(2)} km
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Distance to stop
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
