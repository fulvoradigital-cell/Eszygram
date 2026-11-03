/**
 * Standard API Response payload interface.
 * Enforces consistent shape: { success, data, error } across all API endpoints.
 */
export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
}

