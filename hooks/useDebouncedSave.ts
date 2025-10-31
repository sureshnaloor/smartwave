"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SaveFn<T> = (data: T) => Promise<void> | void;

export function useDebouncedSave<T>(saveFn: SaveFn<T>, delayMs: number = 1000) {
  const timerRef = useRef<number | null>(null);
  const latestArgsRef = useRef<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flush = useCallback(async () => {
    if (latestArgsRef.current == null) return;
    setIsSaving(true);
    setError(null);
    try {
      await Promise.resolve(saveFn(latestArgsRef.current));
      setLastSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
      latestArgsRef.current = null;
      timerRef.current = null;
    }
  }, [saveFn]);

  const schedule = useCallback(
    (data: T) => {
      latestArgsRef.current = data;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        void flush();
      }, delayMs) as unknown as number;
    },
    [delayMs, flush]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    latestArgsRef.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  return { schedule, flush, cancel, isSaving, lastSavedAt, error };
}

