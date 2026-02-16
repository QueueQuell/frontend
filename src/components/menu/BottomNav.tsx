"use client";

import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper, Badge, Typography } from '@mui/material';
import { Home, Search, ShoppingCart, Receipt, Person } from '@mui/icons-material';
import { useCartStore } from '@/lib/store/cartStore';

interface BottomNavProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
  onCartClick: () => void;
}

export default function BottomNav({ currentTab, onTabChange, onCartClick }: BottomNavProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        showLabels
        sx={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            '&.Mui-selected': {
              color: 'var(--primary)',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Search" icon={<Search />} />
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge
              badgeContent={totalItems}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: '18px',
                  minWidth: '18px',
                },
              }}
            >
              <ShoppingCart />
            </Badge>
          }
          onClick={onCartClick}
        />
        <BottomNavigationAction label="Orders" icon={<Receipt />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
      </BottomNavigation>
    </Paper>
  );
}
