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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          backgroundColor: '#0A0A0A',
          color: '#E0E0E0'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#00FFFF' }}>Application Error</h1>
          <p style={{ marginBottom: '1rem' }}>An unrecoverable error occurred in the application.</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#00FFFF',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '0.25rem'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
