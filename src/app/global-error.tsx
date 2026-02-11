'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center font-code text-foreground">
          <h2 className="text-2xl font-headline text-destructive">
            An Unrecoverable Error Occurred
          </h2>
          <p className="text-muted-foreground">
            A critical error has occurred that the application cannot recover from.
          </p>
          <pre className="mt-4 w-full max-w-2xl overflow-auto rounded-md bg-card p-4 text-left text-sm text-destructive">
            {error.stack || error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-primary px-4 py-2 font-headline text-primary-foreground hover:bg-primary/90"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
