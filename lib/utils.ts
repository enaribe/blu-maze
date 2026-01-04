/**
 * Utility Functions for Blu Maze
 */

/**
 * Format phone number for display
 * Example: +2207654321 -> +220 765 4321
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

/**
 * Format currency (Dalasi)
 * Example: 150.5 -> D 150.50
 */
export function formatCurrency(amount: number): string {
  return `D ${amount.toFixed(2)}`;
}

/**
 * Format distance
 * Example: 2.4 -> 2.4 km
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration
 * Example: 12 -> 12 min
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Validate phone number (Gambian format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Gambian numbers typically start with +220 and have 7 digits
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.startsWith('220');
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
