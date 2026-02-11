export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-semibold text-primary">Loading Dashboard...</h2>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        </div>
    );
}
