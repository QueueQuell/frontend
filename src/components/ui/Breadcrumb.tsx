"use client";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <NavigateNextIcon
          fontSize="small"
          sx={{
            color: "primary.main",
            opacity: 0.72,
            textShadow: "10px 10px 20px rgba(0,0,0,0.1)",
          }}
        />
      }
      sx={{
        mb: 3,
        py: 1,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography
            key={item.label}
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              textTransform: "capitalize",
            }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            underline="none"
            color="text.secondary"
            onClick={() => item.href && router.push(item.href)}
            sx={{
              cursor: item.href ? "pointer" : "default",
              fontWeight: 500,
              textTransform: "capitalize",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
