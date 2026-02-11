'use client';

import { useEffect, useState } from 'react';

export default function DateTime() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  if (!date) {
    return (
        <div className="flex flex-col">
            <div className="text-3xl font-bold">--:--</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col">
        <div className="text-3xl font-bold">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <p className="text-xs text-muted-foreground">
            {date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
    </div>
  );
}
