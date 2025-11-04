"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Simulate loading time
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return <LoadingSpinner size={50} />;
  }

  return <>{children}</>;
}
