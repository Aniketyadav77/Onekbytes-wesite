import { useState, useCallback, useEffect } from 'react';
import ErrorLogger from '@/lib/errorLogger';

interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  fallback?: unknown;
}

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  retry: () => Promise<void>;
}

/**
 * Hook for fault-tolerant data fetching with retry logic
 * Ensures one failed request doesn't crash the entire component
 */
export function useSafeFetch<T = unknown>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
): FetchState<T> {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 10000,
    fallback = null,
  } = options;

  const [data, setData] = useState<T | null>(fallback as T);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const performFetch = useCallback(async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        setLoading(true);
        setError(null);

        // Execute with timeout
        const result = await Promise.race([
          fetchFn(),
          new Promise<T>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Request timeout after ${timeout}ms`)),
              timeout
            )
          ),
        ]);
        setData(result);
        setError(null);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < retries) {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All retries failed
    ErrorLogger.logError(lastError, {
      fetchFn: fetchFn.name,
      attempts: retries + 1,
    });

    setError(lastError);
    setData(fallback as T);
    setLoading(false);
  }, [fetchFn, retries, retryDelay, timeout, fallback]);

  useEffect(() => {
    performFetch();
  }, [performFetch]);

  const retry = performFetch;

  return { data, error, loading, retry };
}
