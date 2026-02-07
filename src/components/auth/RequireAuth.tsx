// src/components/auth/RequireAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    
    console.log("token mila hai ya nahi")
    if (!token) {
      
      // No token - redirect to login
      setIsAuthenticated(false);
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    } else {
      // Token exists - allow access
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Show loading while checking
  if (isAuthenticated === null) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          height: "100vh", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, show nothing (redirect is happening)
  if (isAuthenticated === false) {
    return null;
  }

  // Authenticated - render children
  return <>{children}</>;
}