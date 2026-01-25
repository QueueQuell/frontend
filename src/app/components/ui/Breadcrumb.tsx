"use client";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ mb: 3 }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            underline="hover"
            color="text.secondary"
            onClick={() => item.href && router.push(item.href)}
            sx={{ cursor: item.href ? "pointer" : "default", fontWeight: "bold" }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
