import { useState, useCallback } from 'react';

/**
 * Hook to manage pull-to-refresh state
 */
export function useRefresh(refreshFunction: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFunction();
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction]);

  return { refreshing, onRefresh };
}
