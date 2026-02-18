"use client";

import React from 'react';
import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { Grass } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface VegNonVegFilterProps {
  isVegOnly: boolean;
  onVegChange: (veg: boolean) => void;
}

export default function VegNonVegFilter({
  isVegOnly,
  onVegChange,
}: VegNonVegFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onVegChange(event.target.checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={isVegOnly}
            onChange={handleChange}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#22C55E',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#22C55E',
              },
              '& .MuiSwitch-switchBase': {
                color: '#9CA3AF',
              },
              '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                backgroundColor: '#E5E7EB',
              },
            }}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Grass sx={{ fontSize: 18, color: isVegOnly ? '#22C55E' : '#9CA3AF' }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.85rem',
                fontWeight: isVegOnly ? 600 : 500,
                color: isVegOnly ? '#22C55E' : '#666666',
              }}
            >
              Veg Only
            </Typography>
          </Box>
        }
        sx={{
          m: 0,
          cursor: 'pointer',
        }}
      />
    </motion.div>
  );
}
