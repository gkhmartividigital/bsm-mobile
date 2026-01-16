import { useEffect, useCallback } from 'react'
import { useWoltPreordersStore } from '@/stores'

/**
 * Hook to fetch and manage Wolt preorders
 */
export function useWoltPreorders() {
  const {
    preorders,
    pendingCount,
    isLoading,
    isRefreshing,
    isConfirming,
    error,
    successModal,
    fetchPreorders,
    refreshPreorders,
    confirmPreorder,
    clearError,
    closeSuccessModal,
  } = useWoltPreordersStore()

  // Fetch preorders on mount
  useEffect(() => {
    fetchPreorders()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshPreorders()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = useCallback(async () => {
    await refreshPreorders()
  }, [refreshPreorders])

  const handleConfirm = useCallback(async (id: number) => {
    return confirmPreorder(id)
  }, [confirmPreorder])

  return {
    preorders,
    pendingCount,
    isLoading,
    isRefreshing,
    isConfirming,
    error,
    successModal,
    refresh: handleRefresh,
    confirm: handleConfirm,
    clearError,
    closeSuccessModal,
  }
}
