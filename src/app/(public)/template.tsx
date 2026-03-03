"use client";

import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function MenuTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
      {/* Footer - Powered by QueueQuell */}
      <Box
        component="footer"
        sx={{
          py: 1,
          textAlign: "center",
          backgroundColor: "#F9FAFB",
          borderTop: "1px solid #E5E7EB",
          mt: "auto",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#666666",
            fontSize: "0.75rem",
          }}
        >
          Powered by{" "}
          <Link
            href="https://queuequell.com"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              color: "#8B0000",
              fontWeight: 600,
              "&:hover": {
                color: "#6B0000",
              },
            }}
          >
            QueueQuell
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
