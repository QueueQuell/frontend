# API Usage Guide

This guide shows how to use the improved API connectivity features in your application.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Error Handling](#error-handling)
3. [Token Management](#token-management)
4. [Request Caching](#request-caching)
5. [Logging](#logging)
6. [Advanced Features](#advanced-features)

## Basic Usage

### Making API Requests

```typescript
import { createApiClient } from '@/app/lib/apiClient';
import { API_CONFIG } from '@/app/lib/config';

// Create API client instance
const apiClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  retry: API_CONFIG.RETRY,
});

// GET request
const users = await apiClient.get('/admin/users');

// POST request
const newUser = await apiClient.post('/admin/users', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123',
});

// PUT request
const updatedUser = await apiClient.put('/admin/users', {
  id: '123',
  name: 'Jane Doe',
});

// PATCH request
const patchedItem = await apiClient.patch('/inventory/items/123', {
  name: 'Updated Name',
});

// DELETE request
await apiClient.delete('/admin/users?id=123');
```

## Error Handling

### Using Structured Errors

```typescript
import { 
  ApiError, 
  AuthError, 
  NetworkError, 
  ValidationError,
  getUserFriendlyMessage 
} from '@/app/lib/errors';

try {
  const data = await apiClient.get('/protected-endpoint');
} catch (error) {
  if (error instanceof AuthError) {
    // Handle authentication errors
    console.error('Auth error:', error.message);
    // Redirect to login
    router.push('/login');
  } else if (error instanceof NetworkError) {
    // Handle network errors
    console.error('Network error:', error.message);
    // Show offline message
    showToast('No internet connection');
  } else if (error instanceof ValidationError) {
    // Handle validation errors
    console.error('Validation errors:', error.validationErrors);
    // Show field-specific errors
    error.validationErrors?.forEach(err => {
      showFieldError(err.field, err.message);
    });
  } else if (error instanceof ApiError) {
    // Handle other API errors
    const friendlyMessage = getUserFriendlyMessage(error);
    showToast(friendlyMessage);
  }
}
```

### Automatic Retry for Transient Errors

```typescript
// Automatically retries on network errors and 5xx errors
const data = await apiClient.get('/endpoint', {
  retry: {
    maxAttempts: 5,      // Retry up to 5 times
    delay: 1000,         // Start with 1 second delay
    backoff: 2,          // Double the delay each time
  }
});
// Retry delays: 1s, 2s, 4s, 8s, 16s
```

## Token Management

### Automatic Token Refresh

```typescript
import { TokenManager } from '@/app/lib/tokenManager';
import { authApi } from '@/app/lib/api';

// Set up token refresh callback (do this once at app initialization)
TokenManager.setRefreshCallback(async () => {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await authApi.refresh({ refresh_token: refreshToken });
  
  // Update tokens
  TokenManager.setTokens(
    response.access_token,
    response.refresh_token,
    response.token_type
  );

  return response.access_token;
});

// Now all API requests will automatically refresh tokens when needed!
const data = await apiClient.get('/protected-endpoint');
```

### Manual Token Management

```typescript
import { TokenManager } from '@/app/lib/tokenManager';

// Store tokens after login
TokenManager.setTokens(
  accessToken,
  refreshToken,
  'Bearer',
  3600 // expires in 3600 seconds
);

// Set organization ID
TokenManager.setOrgId('org-123');

// Check if authenticated
if (TokenManager.isAuthenticated()) {
  // User is logged in
}

// Check if token is expired
if (TokenManager.isTokenExpired()) {
  // Token needs refresh
}

// Get headers for manual requests
const headers = {
  ...TokenManager.getAuthHeader(),
  ...TokenManager.getOrgHeader(),
};

// Clear tokens on logout
TokenManager.clearTokens();
```

## Request Caching

### Enable Caching for GET Requests

```typescript
// Cache for 5 minutes (default)
const items = await apiClient.get('/inventory/items', {
  cacheConfig: {
    enabled: true,
  }
});

// Cache for 10 minutes
const users = await apiClient.get('/admin/users', {
  cacheConfig: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
  }
});

// Custom cache key
const filteredItems = await apiClient.get('/inventory/items?category=food', {
  cacheConfig: {
    enabled: true,
    key: 'inventory-food-items',
  }
});
```

### Cache Management

```typescript
import { getGlobalCache } from '@/app/lib/cache';

const cache = getGlobalCache();

// Check if cached
if (cache.has('/inventory/items')) {
  console.log('Data is cached');
}

// Get cached data
const cachedData = cache.get('/inventory/items');

// Invalidate specific cache
cache.delete('/inventory/items');

// Invalidate by pattern
cache.invalidate(/^\/inventory/); // Clear all inventory caches

// Clear all cache
cache.clear();

// Get cache statistics
const stats = cache.getStats();
console.log('Cache size:', stats.size);
console.log('Pending requests:', stats.pendingRequests);
```

## Logging

### Using the Logger

```typescript
import { logger, LogLevel } from '@/app/lib/logger';

// Debug logging (only in development)
logger.debug('Processing user data', { userId: '123' });

// Info logging
logger.info('User logged in', { email: 'user@example.com' });

// Warning logging
logger.warn('API rate limit approaching', { remaining: 10 });

// Error logging
logger.error('Failed to save data', error);

// API-specific logging
logger.logRequest('GET', '/api/users');
logger.logResponse('GET', '/api/users', 200, data, 150); // 150ms duration
logger.logError('POST', '/api/users', error);
```

### Configure Logger

```typescript
import { getGlobalLogger, LogLevel } from '@/app/lib/logger';

const logger = getGlobalLogger({
  enabled: true,
  level: LogLevel.DEBUG,
  includeTimestamp: true,
  includeStackTrace: true,
  maxLogs: 200,
});

// Change log level at runtime
logger.setLevel(LogLevel.ERROR); // Only log errors

// Export logs for debugging
const logs = logger.exportLogs();
console.log(logs);

// Get specific logs
const errorLogs = logger.getLogsByLevel(LogLevel.ERROR);
const apiLogs = logger.getLogsByContext('API');
```

## Advanced Features

### Request Interceptors

```typescript
import { createApiClient } from '@/app/lib/apiClient';

const apiClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
});

// Add custom request interceptor
apiClient.addRequestInterceptor(async (url, config) => {
  // Add custom header
  const headers = {
    ...config.headers,
    'X-Custom-Header': 'value',
  };

  // Log request
  console.log('Making request to:', url);

  return { url, config: { ...config, headers } };
});
```

### Response Interceptors

```typescript
// Add custom response interceptor
apiClient.addResponseInterceptor(async (response) => {
  // Log response
  console.log('Received response:', response.status);

  // Transform response
  if (response.headers.get('x-deprecated')) {
    console.warn('This endpoint is deprecated');
  }

  return response;
});
```

### Error Interceptors

```typescript
// Add custom error interceptor
apiClient.addErrorInterceptor((error) => {
  // Send error to monitoring service
  if (error.status >= 500) {
    sendToSentry(error);
  }

  // Re-throw to continue error handling
  throw error;
});
```

### Request Cancellation

```typescript
// Cancel a specific request
apiClient.cancelRequest('GET', '/api/long-running-task');

// Cancel all pending requests (useful on page navigation)
useEffect(() => {
  return () => {
    apiClient.cancelAllRequests();
  };
}, []);
```

### Timeout Configuration

```typescript
// Set timeout for specific request
const data = await apiClient.get('/slow-endpoint', {
  timeout: 60000, // 60 seconds
});

// Disable auth/org headers for public endpoints
const publicData = await apiClient.get('/public/data', {
  includeAuth: false,
  includeOrg: false,
});
```

## React Hooks Examples

### Custom Hook for API Calls

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/app/lib/apiClient';
import { ApiError, getUserFriendlyMessage } from '@/app/lib/errors';

function useApi<T>(endpoint: string, options = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiClient.get<T>(endpoint, options);
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError 
            ? getUserFriendlyMessage(err)
            : 'An unexpected error occurred';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      apiClient.cancelRequest('GET', endpoint);
    };
  }, [endpoint]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useApi<User[]>('/admin/users');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <UserTable users={users} />;
}
```

## Best Practices

1. **Always handle errors**: Use try-catch blocks and provide user feedback
2. **Use caching wisely**: Cache GET requests that don't change frequently
3. **Set appropriate timeouts**: Longer for file uploads, shorter for quick requests
4. **Cancel requests on unmount**: Prevent memory leaks in React components
5. **Use TypeScript types**: Leverage the type system for better code quality
6. **Log important events**: Use the logger for debugging and monitoring
7. **Test error scenarios**: Ensure your error handling works correctly

## Migration from Old Code

### Before
```typescript
const response = await fetch(getApiUrl('/endpoint'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...getOrgHeaders(),
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  throw new Error('Request failed');
}

const result = await response.json();
```

### After
```typescript
const result = await apiClient.post('/endpoint', data);
// That's it! Auth, retries, caching, logging all handled automatically
```

## Support

For questions or issues, please refer to:
- [API_IMPROVEMENTS_SUMMARY.md](./API_IMPROVEMENTS_SUMMARY.md) - Overview of improvements
- [PLAN.md](./PLAN.md) - Detailed implementation plan
- Source code documentation (JSDoc comments)
