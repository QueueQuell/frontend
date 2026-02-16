"use client";

import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Grass, Whatshot, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface VegNonVegFilterProps {
  isVegOnly: boolean;
  isNonVegOnly: boolean;
  onVegChange: (veg: boolean) => void;
  onNonVegChange: (nonVeg: boolean) => void;
}

export default function VegNonVegFilter({
  isVegOnly,
  isNonVegOnly,
  onVegChange,
  onNonVegChange,
}: VegNonVegFilterProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newFilters: string[]) => {
    onVegChange(newFilters.includes('veg'));
    onNonVegChange(newFilters.includes('nonveg'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FilterList sx={{ fontSize: 18, color: '#666666' }} />
        
        <ToggleButtonGroup
          value={[
            ...(isVegOnly ? ['veg'] : []),
            ...(isNonVegOnly ? ['nonveg'] : []),
          ]}
          onChange={handleChange}
          exclusive={false}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.5,
              border: '1px solid #E5E7EB',
              textTransform: 'none',
              fontSize: '0.8rem',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            },
          }}
        >
          <Tooltip title="Show vegetarian items only">
            <ToggleButton
              value="veg"
              selected={isVegOnly}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#22C55E',
                  borderColor: '#22C55E',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#16A34A',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#FFFFFF',
                  },
                  '& span': {
                    color: '#FFFFFF',
                  },
                },
                // When NOT selected - green color
                color: '#22C55E',
                borderColor: '#22C55E',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '& span': {
                  color: '#22C55E',
                },
                '&:hover': {
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                },
              }}
            >
              <Grass sx={{ fontSize: 16, color: 'inherit' }} />
              <span style={{ color: 'inherit' }}>Veg</span>
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Show non-vegetarian items only">
            <ToggleButton
              value="nonveg"
              selected={isNonVegOnly}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#EF4444',
                  borderColor: '#EF4444',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#DC2626',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#FFFFFF',
                  },
                  '& span': {
                    color: '#FFFFFF',
                  },
                },
                // When NOT selected - red color
                color: '#EF4444',
                borderColor: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '& span': {
                  color: '#EF4444',
                },
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <Whatshot sx={{ fontSize: 16, color: 'inherit' }} />
              <span style={{ color: 'inherit' }}>Non-Veg</span>
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
    </motion.div>
  );
}

// Simple Filter Badge Component
interface FilterBadgeProps {
  type: 'veg' | 'nonveg';
  isActive: boolean;
  onClick: () => void;
}

export function FilterBadge({ type, isActive, onClick }: FilterBadgeProps) {
  const isVeg = type === 'veg';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isActive 
            ? (isVeg ? '#22C55E' : '#EF4444')
            : '#E5E7EB',
          backgroundColor: isActive
            ? (isVeg ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
            : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: isVeg ? '#22C55E' : '#EF4444',
          },
        }}
      >
        {isVeg ? (
          <Grass sx={{ fontSize: 14, color: isActive ? '#22C55E' : '#666666' }} />
        ) : (
          <Whatshot sx={{ fontSize: 14, color: isActive ? '#EF4444' : '#666666' }} />
        )}
        <span style={{
          fontSize: '0.75rem',
          fontWeight: isActive ? 600 : 400,
          color: isActive 
            ? (isVeg ? '#22C55E' : '#EF4444')
            : '#333333',
        }}>
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      </Box>
    </motion.div>
  );
}
