# API Connectivity Improvement Plan

## Information Gathered

### Current State Analysis:
- **api.ts**: Contains main API request function and all API endpoint methods
- **config.ts**: Has duplicate apiRequest function, API configuration, and auth/org header helpers
- **types.ts**: Contains TypeScript interfaces for API requests/responses
- **Usage**: Pages like login.tsx and inventory/list/page.tsx use the API directly

### Key Issues Identified:
1. Duplicate apiRequest functions in config.ts and api.ts
2. No automatic token refresh mechanism
3. Basic error handling without retry logic or structured errors
4. localStorage accessed directly (not safe for SSR)
5. No request caching or deduplication
6. Some API methods use `any` types
7. No request/response interceptors
8. Missing timeout handling
9. No request cancellation support
10. No logging for debugging

## Detailed Implementation Plan

### Phase 1: Core Infrastructure (Priority: High)
- [ ] **Step 1.1**: Create enhanced error types and classes
  - File: `src/app/lib/errors.ts` (NEW)
  - Add ApiError class with error codes, status, and details
  - Add NetworkError, TimeoutError, AuthError classes
  
- [ ] **Step 1.2**: Create token management utility
  - File: `src/app/lib/tokenManager.ts` (NEW)
  - Safe localStorage wrapper with SSR checks
  - Token expiration detection
  - Token refresh queue management

- [ ] **Step 1.3**: Create API client with interceptors
  - File: `src/app/lib/apiClient.ts` (NEW)
  - Request/response interceptors
  - Automatic token refresh
  - Retry logic with exponential backoff
  - Timeout handling
  - Request cancellation with AbortController

### Phase 2: Enhanced Features (Priority: High)
- [ ] **Step 2.1**: Add request caching layer
  - File: `src/app/lib/cache.ts` (NEW)
  - In-memory cache with TTL
  - Cache invalidation strategies
  - Request deduplication

- [ ] **Step 2.2**: Create logging utility
  - File: `src/app/lib/logger.ts` (NEW)
  - Request/response logging (dev mode only)
  - Error logging
  - Performance metrics

### Phase 3: Refactoring (Priority: Medium)
- [ ] **Step 3.1**: Update config.ts
  - Remove duplicate apiRequest function
  - Keep only configuration and helper functions
  - Add API client configuration options

- [ ] **Step 3.2**: Update types.ts
  - Replace all `any` types with proper interfaces
  - Add error response types
  - Add pagination types
  - Add cache configuration types

- [ ] **Step 3.3**: Update api.ts
  - Use new apiClient instead of fetch
  - Remove old apiRequest function
  - Add JSDoc comments
  - Improve type safety

### Phase 4: Testing & Documentation (Priority: Medium)
- [ ] **Step 4.1**: Update existing pages
  - Update login page to use new error handling
  - Update inventory list to use caching
  - Add loading states

- [ ] **Step 4.2**: Add documentation
  - Add JSDoc comments to all public APIs
  - Create usage examples
  - Document error handling patterns

## Dependencies to be Added
- None (using native browser APIs and TypeScript)

## Followup Steps
1. Test token refresh flow
2. Test error handling with various scenarios
3. Verify caching behavior
4. Test request cancellation
5. Verify SSR compatibility
6. Performance testing

## Files to be Created
1. `src/app/lib/errors.ts` - Error types and classes
2. `src/app/lib/tokenManager.ts` - Token management
3. `src/app/lib/apiClient.ts` - Enhanced API client
4. `src/app/lib/cache.ts` - Request caching
5. `src/app/lib/logger.ts` - Logging utility

## Files to be Modified
1. `src/app/lib/config.ts` - Remove duplicate, add config
2. `src/app/lib/types.ts` - Improve type safety
3. `src/app/lib/api.ts` - Use new apiClient
4. `src/app/login/page.tsx` - Example usage update
5. `src/app/inventory/list/page.tsx` - Example usage update

## Breaking Changes
- None (backward compatible wrapper will be maintained)

## Timeline
- Phase 1: Core Infrastructure (Steps 1.1-1.3)
- Phase 2: Enhanced Features (Steps 2.1-2.2)
- Phase 3: Refactoring (Steps 3.1-3.3)
- Phase 4: Testing & Documentation (Steps 4.1-4.2)
