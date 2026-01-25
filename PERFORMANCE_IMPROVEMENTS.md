# Performance Improvement Recommendations

## 🚀 Priority: High Impact

### 1. **Enable Image Optimization**
**Current Issue:** Images are set to `unoptimized: true` in `next.config.ts`

**Impact:** Large image files slow down page loads significantly

**Solution:**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'foodess.com',
    },
    {
      protocol: 'https',
      hostname: 'queuequell-backend.onrender.com',
    },
  ],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

**Benefits:**
- Automatic image optimization and format conversion
- Responsive image sizes
- Reduced bandwidth usage by 30-50%
- Faster page loads

---

### 2. **Implement SWR for Data Fetching**
**Current Issue:** Direct API calls without caching/deduplication in components

**Impact:** Unnecessary API calls, no request deduplication, poor UX

**Solution:**
```typescript
// Create hooks/useItems.ts
import useSWR from 'swr';
import { inventoryApi } from '@/app/lib/api';

export function useItems() {
  const { data, error, isLoading, mutate } = useSWR(
    '/inventory/items',
    () => inventoryApi.getItems(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2s
      refreshInterval: 0, // Disable auto-refresh
    }
  );

  return {
    items: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
```

**Benefits:**
- Automatic request deduplication
- Built-in caching
- Background revalidation
- Better loading states
- Reduced server load

---

### 3. **Add React Component Memoization**
**Current Issue:** Components re-render unnecessarily

**Impact:** Unnecessary re-renders cause performance degradation

**Solution:**
```typescript
// Example: src/app/components/menu/MenuItems.tsx
import { memo, useMemo } from 'react';

export default memo(function MenuItems({
  items,
  searchQuery,
  onSearchChange,
  onAddToCart,
  isSmallScreen,
}: MenuItemsProps) {
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // ... rest of component
});
```

**Components to optimize:**
- `MenuItems.tsx`
- `Sidebar.tsx` (memoize sections)
- `CommonCard.tsx`
- List items in catalog/categories pages

**Benefits:**
- Reduced re-renders by 40-60%
- Smoother UI interactions
- Better performance on low-end devices

---

### 4. **Implement Code Splitting**
**Current Issue:** All code loaded upfront

**Impact:** Large initial bundle size, slow first load

**Solution:**
```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const MenuItems = dynamic(() => import('./MenuItems'), {
  loading: () => <CircularProgress />,
  ssr: false, // If component doesn't need SSR
});

// For pages with heavy dependencies
const ChartComponent = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton variant="rectangular" height={400} />,
});
```

**Components to lazy load:**
- Chart/analytics components
- Heavy form components
- Modal dialogs
- Third-party integrations

**Benefits:**
- Reduced initial bundle size by 30-50%
- Faster Time to Interactive (TTI)
- Better Core Web Vitals scores

---

### 5. **Optimize Sidebar Component**
**Current Issue:** Sidebar re-renders on every state change

**Impact:** Unnecessary re-renders of navigation

**Solution:**
```typescript
// src/app/components/navigation/Sidebar.tsx
import { memo, useMemo, useCallback } from 'react';

// Memoize sidebar sections
const SidebarSection = memo(function SidebarSection({ ... }) {
  // Component implementation
});

// Memoize toggle function
const useSidebarToggle = () => {
  return useCallback((key: SectionKey) => {
    setOpen((s) => {
      const newState = { ...DEFAULT_STATE };
      newState[key] = !s[key];
      return newState;
    });
  }, []);
};
```

**Benefits:**
- Smoother sidebar interactions
- Reduced CPU usage
- Better mobile performance

---

### 6. **Add Request Deduplication to API Layer**
**Current Issue:** Multiple components might call same API simultaneously

**Impact:** Duplicate requests waste bandwidth and server resources

**Solution:**
```typescript
// Enhance api.ts to use cache.ts
import { requestCache } from './cache';

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true,
  includeOrg = true
): Promise<T> => {
  // Use cache for GET requests
  if (!options.method || options.method === 'GET') {
    return requestCache.getOrSet(
      endpoint,
      () => performRequest<T>(endpoint, options, includeAuth, includeOrg),
      options
    );
  }
  
  return performRequest<T>(endpoint, options, includeAuth, includeOrg);
};
```

**Benefits:**
- Eliminates duplicate requests
- Faster responses from cache
- Reduced server load

---

## 🎯 Priority: Medium Impact

### 7. **Optimize Font Loading**
**Current Issue:** Multiple fonts loaded, blocking render

**Solution:**
```typescript
// src/app/layout.tsx
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // Add this
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap', // Add this
  preload: false, // Only preload primary font
});
```

**Benefits:**
- Faster font rendering
- Reduced layout shift
- Better CLS score

---

### 8. **Implement Virtual Scrolling for Large Lists**
**Current Issue:** Rendering all items at once in catalog/categories

**Impact:** Performance degrades with many items

**Solution:**
```typescript
// Use react-window or @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }) {
  const parentRef = useRef();
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemCard item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Benefits:**
- Handles thousands of items smoothly
- Constant memory usage
- Better performance on mobile

---

### 9. **Add Service Worker for Offline Support**
**Current Issue:** No offline caching

**Solution:**
```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

**Benefits:**
- Offline functionality
- Faster repeat visits
- Reduced server load
- Better mobile experience

---

### 10. **Optimize Bundle Size**
**Current Issue:** Large bundle size

**Solution:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... existing config
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
```

**Benefits:**
- Smaller bundle sizes
- Faster load times
- Better tree-shaking

---

## 🔧 Priority: Low Impact (Nice to Have)

### 11. **Add Performance Monitoring**
```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log(metric);
  }
}
```

### 12. **Implement Debouncing for Search**
```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    setSearchQuery(value);
  },
  300
);
```

### 13. **Add Loading Skeletons**
Replace loading spinners with skeleton screens for better perceived performance.

### 14. **Optimize MUI Imports**
```typescript
// Instead of:
import { Button, TextField } from '@mui/material';

// Use:
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
```

---

## 📊 Expected Performance Gains

| Optimization | Impact | Expected Improvement |
|-------------|--------|---------------------|
| Image Optimization | High | 30-50% faster page loads |
| SWR Implementation | High | 40-60% fewer API calls |
| Component Memoization | High | 40-60% fewer re-renders |
| Code Splitting | Medium | 30-50% smaller initial bundle |
| Request Deduplication | Medium | 20-30% fewer duplicate requests |
| Font Optimization | Medium | 10-20% faster FCP |
| Virtual Scrolling | Medium | Handles 10x more items smoothly |

---

## 🎯 Implementation Priority

1. **Week 1:** Image optimization, SWR implementation
2. **Week 2:** Component memoization, code splitting
3. **Week 3:** Request deduplication, font optimization
4. **Week 4:** Virtual scrolling, bundle optimization

---

## 📝 Quick Wins (Can be done immediately)

1. ✅ Enable image optimization in `next.config.ts`
2. ✅ Add `display: 'swap'` to fonts
3. ✅ Wrap list components with `React.memo`
4. ✅ Use `useMemo` for filtered/computed data
5. ✅ Add `loading="lazy"` to images below the fold

---

## 🔍 Monitoring

After implementing these changes, monitor:
- **Lighthouse Scores** (aim for 90+)
- **Core Web Vitals** (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Bundle Size** (keep under 200KB initial JS)
- **API Call Count** (reduce by 40-60%)
- **Time to Interactive** (aim for < 3s)

