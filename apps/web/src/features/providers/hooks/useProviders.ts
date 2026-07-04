import { useState, useEffect, useCallback } from 'react';
import { getProviders } from '../api/providers.api';
import { PaginatedProviders } from '../types';

export function useProviders(initialParams: Record<string, unknown> = {}) {
  const [data, setData] = useState<PaginatedProviders | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>(initialParams);

  const fetchProviders = useCallback(async (currentParams: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProviders(currentParams);
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders(params);
  }, [params, fetchProviders]);

  const updateParams = (newParams: Record<string, unknown>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  };

  return { data, loading, error, params, updateParams, refetch: () => fetchProviders(params) };
}
