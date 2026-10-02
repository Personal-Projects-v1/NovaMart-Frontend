"use client";

import { useEffect, useState } from "react";

/**
 * Time left until `target`. The first render (server and hydration) shows zeros and the real value
 * is filled in right after mount - computing it during render would differ between server and client.
 */
export function useCountdown(target: string) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [target]);

  const ms = remaining ?? 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const expired = remaining !== null && remaining <= 0;

  return { hours, minutes, seconds, expired };
}
