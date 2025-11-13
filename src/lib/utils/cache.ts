/**
 * Request Caching Module
 * Provides in-memory caching with TTL and request deduplication
 */

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Pending request tracker for deduplication
 */
interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

/**
 * Cache configuration options
 */
export interface CacheConfig {
  defaultTTL?: number; // Default time-to-live in milliseconds
  maxSize?: number; // Maximum number of cache entries
  cleanupInterval?: number; // Interval for cleanup in milliseconds
}

/**
 * Request Cache class
 */
export class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, PendingRequest<any>> = new Map();
  private defaultTTL: number;
  private maxSize: number;
  private cleanupInterval: number;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.defaultTTL || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = config.maxSize || 100;
    this.cleanupInterval = config.cleanupInterval || 60 * 1000; // 1 minute

    // Start cleanup timer
    this.startCleanup();
  }

  /**
   * Generate cache key from request parameters
   */
  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Get cached data
   */
  get<T>(url: string, options?: RequestInit): T | null {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(url: string, data: T, options?: RequestInit, ttl?: number): void {
    const key = this.generateKey(url, options);

    // Check if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Check if data is cached
   */
  has(url: string, options?: RequestInit): boolean {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cached data
   */
  delete(url: string, options?: RequestInit): boolean {
    const key = this.generateKey(url, options);
    return this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidate(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Get or set with a factory function
   */
  async getOrSet<T>(
    url: string,
    factory: () => Promise<T>,
    options?: RequestInit,
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(url, options);
    if (cached !== null) {
      return cached;
    }

    // Check if request is already pending (deduplication)
    const key = this.generateKey(url, options);
    const pending = this.pendingRequests.get(key);

    if (pending) {
      // Request is already in flight, return the existing promise
      return pending.promise as Promise<T>;
    }

    // Create new request
    const promise = factory()
      .then((data) => {
        // Cache the result
        this.set(url, data, options, ttl);
        // Remove from pending
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store as pending
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();

    // Clean up expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }

    // Clean up stale pending requests (older than 30 seconds)
    for (const [key, pending] of this.pendingRequests.entries()) {
      if (now - pending.timestamp > 30000) {
        this.pendingRequests.delete(key);
      }
    }
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      return;
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);

    // Don't prevent Node.js from exiting
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    pendingRequests: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      pendingRequests: this.pendingRequests.size,
    };
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    this.stopCleanup();
    this.clear();
  }
}

/**
 * Create a global cache instance
 */
let globalCache: RequestCache | null = null;

/**
 * Get or create global cache instance
 */
export function getGlobalCache(config?: CacheConfig): RequestCache {
  if (!globalCache) {
    globalCache = new RequestCache(config);
  }
  return globalCache;
}

/**
 * Reset global cache
 */
export function resetGlobalCache(): void {
  if (globalCache) {
    globalCache.destroy();
    globalCache = null;
  }
}
