"use client";

import { authService } from "@/lib/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";

export default function SignInSide() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email && !password) {
      setError("Please enter email and password.");
      return;
    } else if (!email) {
      setError("Please enter email.");
      return;
    } else if (!password) {
      setError("Please enter password.");
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
      });

      if (response.success) {
        // Token is already stored in authService.login

        // Get the 'next' parameter from URL
        const searchParams = new URLSearchParams(window.location.search);
        const nextUrl = searchParams.get("next") || "/home";

        // Decode and redirect
        const decodedNext = decodeURIComponent(nextUrl);
        router.push(decodedNext);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* First Column - Header and Images */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          elevation={4}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
              {/* Logo */}
              <Box
                component="a"
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "text.primary",
                }}
              >
                <Box
                  component="img"
                  src="/queuequell-logo.png"
                  alt="QueueQuell Logo"
                  sx={{ width: 50, height: "auto" }}
                />
              </Box>

              {/* Right side */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Link
                  href="/faqs"
                  sx={{
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Need help?
                </Link>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Illustration */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box
            component="img"
            src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/illustrations/illustration-dashboard.webp"
            alt="Dashboard illustration"
            loading="lazy"
            sx={{ maxWidth: "100%", height: "auto", mb: 4 }}
          />
        </Box>
      </Box>

      {/* Second Column - Sign-in */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 4,
          minHeight: "100vh",
          boxShadow: "-4px 0 8px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Sign in to your account
            </Typography>
          </Box>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              size="medium"
              sx={{
                mb: 2,
                minWidth: 400,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            />

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="6+ characters"
                size="medium"
                sx={{
                  minWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "gray" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <Grid
              container
              justifyContent="flex-end"
              sx={{ mt: 2, position: "relative" }}
            >
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError(null)}
                  sx={{
                    mt: 2,
                    position: "absolute",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {error}
                </Alert>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
