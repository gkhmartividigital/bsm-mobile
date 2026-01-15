import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ka } from 'date-fns/locale';

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string | null | undefined, pattern = 'dd MMM yyyy'): string {
  if (!dateString) return '-';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '-';
    return format(date, pattern);
  } catch {
    return '-';
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | null | undefined): string {
  return formatDate(dateString, 'dd MMM yyyy, HH:mm');
}

/**
 * Format time only
 */
export function formatTime(dateString: string | null | undefined): string {
  return formatDate(dateString, 'HH:mm');
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '-';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '-';
  }
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(
  slotDate: string | null | undefined,
  timeSlot: string | null | undefined
): string {
  if (!slotDate || !timeSlot) return '';
  if (timeSlot === 'now') return 'ASAP';
  return `${formatDate(slotDate, 'dd MMM')} - ${timeSlot}`;
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // Format Georgian phone
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | null | undefined, currency = 'GEL'): string {
  if (price === null || price === undefined) return '-';
  return `${price.toFixed(2)} ${currency}`;
}

/**
 * Format ETA in minutes to readable string
 */
export function formatEta(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '-';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
