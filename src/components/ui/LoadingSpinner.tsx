"use client";
import { motion } from "framer-motion";
import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <CircularProgress size={size} />
      </motion.div>
    </Box>
  );
}
