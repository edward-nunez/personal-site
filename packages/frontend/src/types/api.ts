/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, string>;
}
