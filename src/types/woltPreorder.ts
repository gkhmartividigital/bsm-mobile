export interface WoltPreorder {
  id: number
  orderNumber: string
  status: WoltPreorderStatus
  customerName: string
  customerPhone: string
  address: string
  lat?: number
  lon?: number
  productName: string
  quantity: number
  productPrice: number
  deliveryPrice: number
  deliveryTime?: string
  deliveryEta?: number
  deliveryInstructions?: string
  total: number
  woltOrderId?: string
  woltTrackingUrl?: string
  createdAt: string
  confirmedAt?: string
  sentToWoltAt?: string
}

export type WoltPreorderStatus =
  | 'pending_warehouse'
  | 'confirmed'
  | 'sent_to_wolt'
  | 'delivered'
  | 'cancelled'
  | 'wolt_failed'

export interface WoltPreordersResponse {
  success: boolean
  preorders: WoltPreorder[]
  pendingCount: number
  total: number
}

export interface WoltConfirmResponse {
  success: boolean
  preorder?: {
    id: number
    orderNumber: string
    status: string
    woltOrderId: string
    woltTrackingUrl: string
  }
  error?: string
}
