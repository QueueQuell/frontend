/**
 * API Error Handling Module
 * Provides structured error types for better error handling and debugging
 */

/**
 * Error codes for different types of API errors
 */
export enum ApiErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  ABORT = 'ABORT',
  
  // HTTP errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Auth errors
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  REFRESH_FAILED = 'REFRESH_FAILED',
  
  // Client errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status?: number;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: ApiErrorCode = ApiErrorCode.UNKNOWN_ERROR,
    status?: number,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return (
      this.code === ApiErrorCode.NETWORK_ERROR ||
      this.code === ApiErrorCode.TIMEOUT ||
      (this.status !== undefined && this.status >= 500)
    );
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors (connection issues, DNS failures, etc.)
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, ApiErrorCode.NETWORK_ERROR, undefined, details);
    this.name = 'NetworkError';
  }
}

/**
 * Request timeout errors
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timeout', timeout?: number) {
    super(message, ApiErrorCode.TIMEOUT, 408, { timeout });
    this.name = 'TimeoutError';
  }
}

/**
 * Authentication/Authorization errors
 */
export class AuthError extends ApiError {
  constructor(
    message: string,
    code: ApiErrorCode = ApiErrorCode.UNAUTHORIZED,
    status: number = 401,
    details?: any
  ) {
    super(message, code, status, details);
    this.name = 'AuthError';
  }
}

/**
 * Validation errors (400 Bad Request)
 */
export class ValidationError extends ApiError {
  public readonly validationErrors?: Array<{
    field: string;
    message: string;
  }>;

  constructor(message: string, validationErrors?: any) {
    super(message, ApiErrorCode.VALIDATION_ERROR, 400, validationErrors);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Server errors (5xx)
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error', status: number = 500, details?: any) {
    super(message, ApiErrorCode.SERVER_ERROR, status, details);
    this.name = 'ServerError';
  }
}

/**
 * Parse error from response
 */
export async function parseErrorFromResponse(response: Response): Promise<ApiError> {
  let errorData: any = {};
  let errorMessage = response.statusText || 'Request failed';

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } else {
      errorMessage = await response.text();
    }
  } catch (e) {
    // Failed to parse error response, use default message
  }

  // Map HTTP status to appropriate error type
  switch (response.status) {
    case 400:
      return new ValidationError(errorMessage, errorData.errors || errorData.detail);
    case 401:
      return new AuthError(errorMessage, ApiErrorCode.UNAUTHORIZED, 401, errorData);
    case 403:
      return new AuthError(errorMessage, ApiErrorCode.FORBIDDEN, 403, errorData);
    case 404:
      return new ApiError(errorMessage, ApiErrorCode.NOT_FOUND, 404, errorData);
    case 409:
      return new ApiError(errorMessage, ApiErrorCode.CONFLICT, 409, errorData);
    case 408:
      return new TimeoutError(errorMessage);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(errorMessage, response.status, errorData);
    default:
      return new ApiError(errorMessage, ApiErrorCode.UNKNOWN_ERROR, response.status, errorData);
  }
}

/**
 * Parse error from exception
 */
export function parseErrorFromException(error: any): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError('Network request failed. Please check your connection.', error);
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    return new TimeoutError('Request was aborted');
  }

  // Generic error
  return new ApiError(
    error.message || 'An unexpected error occurred',
    ApiErrorCode.UNKNOWN_ERROR,
    undefined,
    error
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return (
    error instanceof AuthError ||
    (error instanceof ApiError &&
      (error.code === ApiErrorCode.UNAUTHORIZED ||
        error.code === ApiErrorCode.TOKEN_EXPIRED ||
        error.code === ApiErrorCode.TOKEN_INVALID))
  );
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof ApiError) {
    return error.isRetryable();
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (error instanceof ApiError) {
    // Return custom messages for common errors
    switch (error.code) {
      case ApiErrorCode.NETWORK_ERROR:
        return 'Unable to connect. Please check your internet connection.';
      case ApiErrorCode.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ApiErrorCode.UNAUTHORIZED:
        return 'You are not authorized. Please log in again.';
      case ApiErrorCode.FORBIDDEN:
        return 'You do not have permission to perform this action.';
      case ApiErrorCode.NOT_FOUND:
        return 'The requested resource was not found.';
      case ApiErrorCode.SERVER_ERROR:
        return 'Server error. Please try again later.';
      case ApiErrorCode.VALIDATION_ERROR:
        return error.message; // Validation messages are usually user-friendly
      default:
        return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
