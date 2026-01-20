import { create } from 'zustand'
import { WoltPreorder, WoltConfirmResponse } from '@/types'
import { woltApi } from '@/services/api'

interface SuccessModalData {
  orderNumber: string
  woltOrderId: string
  woltTrackingUrl?: string
}

interface WoltPreordersState {
  preorders: WoltPreorder[]
  pendingCount: number
  isLoading: boolean
  isRefreshing: boolean
  isConfirming: number | null
  error: string | null
  successModal: SuccessModalData | null
}

interface WoltPreordersActions {
  fetchPreorders: (status?: string) => Promise<void>
  refreshPreorders: () => Promise<void>
  confirmPreorder: (id: number) => Promise<boolean>
  clearError: () => void
  closeSuccessModal: () => void
}

type WoltPreordersStore = WoltPreordersState & WoltPreordersActions

const initialState: WoltPreordersState = {
  preorders: [],
  pendingCount: 0,
  isLoading: false,
  isRefreshing: false,
  isConfirming: null,
  error: null,
  successModal: null,
}

export const useWoltPreordersStore = create<WoltPreordersStore>((set, get) => ({
  ...initialState,

  fetchPreorders: async (status?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await woltApi.getPreorders(status)
      set({
        preorders: response?.preorders ?? [],
        pendingCount: response?.pendingCount ?? 0,
        isLoading: false,
      })
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number }
      set({ isLoading: false, error: err.message ?? 'Failed to fetch preorders' })
    }
  },

  refreshPreorders: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await woltApi.getPreorders()
      set({
        preorders: response?.preorders ?? [],
        pendingCount: response?.pendingCount ?? 0,
        isRefreshing: false,
      })
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number }
      set({ isRefreshing: false, error: err.message ?? 'Failed to refresh preorders' })
    }
  },

  confirmPreorder: async (id: number) => {
    set({ isConfirming: id, error: null })
    try {
      const response: WoltConfirmResponse = await woltApi.confirmPreorder(id)

      if (response.success && response.preorder) {
        // Remove from preorders list
        set(state => ({
          preorders: state.preorders.filter(p => p.id !== id),
          pendingCount: Math.max(0, state.pendingCount - 1),
          isConfirming: null,
          successModal: {
            orderNumber: response.preorder!.orderNumber,
            woltOrderId: response.preorder!.woltOrderId,
            woltTrackingUrl: response.preorder!.woltTrackingUrl,
          },
        }))
        return true
      } else {
        set({
          isConfirming: null,
          error: response.error ?? 'Failed to confirm preorder',
        })
        return false
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      set({
        isConfirming: null,
        error: err.message ?? 'Failed to send to Wolt',
      })
      return false
    }
  },

  clearError: () => set({ error: null }),

  closeSuccessModal: () => set({ successModal: null }),
}))
