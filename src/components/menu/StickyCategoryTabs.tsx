"use client";

import React from 'react';
import { Box, Tabs, Tab, Chip, useMediaQuery, useTheme } from '@mui/material';
import { RestaurantMenu, Restaurant, Cake, LocalDrink, Icecream } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
}

interface StickyCategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'all': RestaurantMenu,
  'appetizers': RestaurantMenu,
  'starters': RestaurantMenu,
  'main-courses': Restaurant,
  'mains': Restaurant,
  'main': Restaurant,
  'desserts': Cake,
  'dessert': Cake,
  'beverages': LocalDrink,
  'drinks': LocalDrink,
  'beverage': LocalDrink,
  'ice-cream': Icecream,
};

export default function StickyCategoryTabs({
  categories,
  selectedCategory,
  onCategorySelect,
}: StickyCategoryTabsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getIcon = (categoryId: string) => {
    const lowerId = categoryId.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerId.includes(key)) {
        return icon;
      }
    }
    return RestaurantMenu;
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Tabs
        value={selectedCategory}
        onChange={(_, newValue) => onCategorySelect(newValue)}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons="auto"
        centered={!isMobile}
        sx={{
          minHeight: 56,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: 'var(--primary)',
          },
          '& .MuiTab-root': {
            minHeight: 56,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            px: isMobile ? 1.5 : 3,
            '&.Mui-selected': {
              color: 'var(--primary)',
            },
          },
        }}
      >
        {categories.map((category) => {
          const IconComponent = getIcon(category.id);
          return (
            <Tab
              key={category.id}
              value={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconComponent sx={{ fontSize: isMobile ? 18 : 20 }} />
                  {!isMobile && <span>{category.name}</span>}
                  {category.count !== undefined && (
                    <Chip
                      label={category.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        backgroundColor: 'var(--surface-hover)',
                      }}
                    />
                  )}
                </Box>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
}

// Animated Category Tab with Framer Motion
interface AnimatedCategoryTabProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export function AnimatedCategoryTab({ category, isSelected, onClick }: AnimatedCategoryTabProps) {
  const IconComponent = getIconFromName(category.id);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
          color: isSelected ? '#fff' : 'var(--text-primary)',
          transition: 'all 0.2s ease',
          border: isSelected ? 'none' : '1px solid var(--border)',
          '&:hover': {
            backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-hover)',
          },
        }}
      >
        <IconComponent sx={{ fontSize: 18 }} />
        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{category.name}</span>
      </Box>
    </motion.div>
  );
}

function getIconFromName(categoryId: string): React.ComponentType<any> {
  const lowerId = categoryId.toLowerCase();
  if (lowerId.includes('appetizer') || lowerId.includes('starter')) return RestaurantMenu;
  if (lowerId.includes('main') || lowerId.includes('course')) return Restaurant;
  if (lowerId.includes('dessert') || lowerId.includes('cake')) return Cake;
  if (lowerId.includes('beverage') || lowerId.includes('drink')) return LocalDrink;
  if (lowerId.includes('ice')) return Icecream;
  return RestaurantMenu;
}
