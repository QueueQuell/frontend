"use client";

import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type?: 'menu-item' | 'cart-item' | 'list';
  count?: number;
}

// List Item Skeleton
function ListItemSkeleton() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    </Box>
  );
}

// Menu Item Skeleton
function MenuItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={180}
          sx={{ borderRadius: 0 }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="text" width={60} height={28} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Cart Item Skeleton
function CartItemSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: '1px solid var(--border)',
      }}
    >
      <Skeleton variant="rounded" width={70} height={70} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="text" width="40%" height={20} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={60} height={24} />
        </Box>
      </Box>
    </Box>
  );
}

// Category Tabs Skeleton
export function CategoryTabsSkeleton() {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={100}
            height={36}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function LoadingSkeleton({ type = 'menu-item', count = 6 }: LoadingSkeletonProps) {
  if (type === 'menu-item') {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <MenuItemSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'cart-item') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <CartItemSkeleton key={index} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <ListItemSkeleton key={index} />
      ))}
    </Box>
  );
}

// Page Skeleton
export function PageSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 2 }} />
        <Box sx={{ flex: 1 }} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>

      {/* Category Tabs */}
      <CategoryTabsSkeleton />

      {/* Content */}
      <Box sx={{ mt: 3 }}>
        <LoadingSkeleton type="menu-item" count={4} />
      </Box>
    </Box>
  );
}
