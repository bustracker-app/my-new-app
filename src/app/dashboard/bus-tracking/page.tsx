import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import EtaForm from "./eta-form";
import { Bus } from "lucide-react";

export default function BusTrackingPage() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Live Bus Tracking</CardTitle>
                    <CardDescription>Real-time location of the school bus.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-video w-full">
                        <Image 
                            src="https://picsum.photos/seed/map/800/450"
                            alt="Map with bus location"
                            fill
                            className="rounded-md object-cover"
                            data-ai-hint="map satellite"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative flex h-10 w-10">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-10 w-10 bg-accent border-2 border-accent-foreground justify-center items-center">
                                    <Bus className="h-5 w-5 text-accent-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                        <p>Bus #SN123 - Route A</p>
                        <p>Last updated: <span className="font-medium text-foreground">Just now</span></p>
                    </div>
                </CardContent>
            </Card>
            <EtaForm />
        </div>
    );
}
