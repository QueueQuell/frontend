"use client";

import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, TextField, InputAdornment, Badge, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { ShoppingCart, Search, Menu, Notifications, LocalOffer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';

interface MenuHeaderEnhancedProps {
  restaurantName?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function MenuHeaderEnhanced({
  restaurantName = "QueueQuell",
  searchQuery,
  onSearchChange,
  onCartClick,
  onMenuClick,
  showMenuButton = false,
}: MenuHeaderEnhancedProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Menu Button (Mobile) */}
        {showMenuButton && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <Menu />
          </IconButton>
        )}

        {/* Logo & Restaurant Name */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              minWidth: 'fit-content',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              QQ
            </Box>
            {!isMobile && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                    color: 'var(--text-primary)',
                  }}
                >
                  {restaurantName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--text-secondary)',
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  Fresh & Delicious
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Search Bar */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mx: 2 }}>
          <TextField
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{
              width: '100%',
              maxWidth: 500,
              display: { xs: 'none', sm: 'block' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'var(--surface-hover)',
                '&:hover': {
                  backgroundColor: 'var(--surface-hover)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'var(--surface)',
                  boxShadow: '0 0 0 2px var(--primary)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Mobile Search Button */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={() => onSearchChange('')}
        >
          <Search />
        </IconButton>

        {/* Cart Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={onCartClick}
            sx={{
              backgroundColor: 'var(--surface-hover)',
              '&:hover': {
                backgroundColor: 'var(--primary)',
                color: '#fff',
              },
            }}
          >
            <Badge
              badgeContent={totalItems}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 18,
                },
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
}
