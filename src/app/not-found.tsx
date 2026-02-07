"use client";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import CommonLayout from "../components/layouts/CommonLayout";

export default function NotFound() {
  return (
    // <CommonLayout requireAuth={false}> {/* Don't require auth for 404 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" sx={{ fontSize: 72, fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          Page not found.
        </Typography>
        <Button component={Link} href="/home" variant="contained" color="primary">
          Go back to Home
        </Button>
      </Box>
    // </CommonLayout>
  );
}