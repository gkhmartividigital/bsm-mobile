/**
 * Address validation request
 */
export interface ValidateAddressPayload {
  address: string;
  orderId?: string;
}

/**
 * Address validation response
 */
export interface ValidateAddressResponse {
  action: 'SEND_TO_WOLT' | 'SEND_MAP_LINK' | 'ASK_TO_SELECT' | 'ASK_FOR_ADDRESS' | 'MANUAL_HANDLING';
  matchType: 'EXACT' | 'PARTIAL' | 'STREET_ONLY' | 'AMBIGUOUS' | 'NOT_FOUND';
  shipping?: {
    coordinates: {
      lat: number;
      lon: number;
    };
    street: string;
    city: string;
    country: string;
    formattedAddress: string;
  };
  mapConfirmationUrl?: string;
  confidence: number;
  aiReasoning?: string;
  woltValid?: boolean;
  woltPrice?: number;
  options?: AddressOption[];
}

/**
 * Address option for selection
 */
export interface AddressOption {
  street: string;
  fullAddress: string;
  addressCount: number;
}

/**
 * Coordinates
 */
export interface Coordinates {
  lat: number;
  lon: number;
}
