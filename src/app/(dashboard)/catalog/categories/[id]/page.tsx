"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { categoryService } from "@/lib/api/services/category.service";
import type { Category } from "@/lib/api/types";

export default function CategoryViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategory = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      const response = await categoryService.getById(id);
      if (response.success && response.data) {
        setCategory(response.data as Category);
      } else {
        setError(response.message || "Category not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !category) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Catalog", href: "/catalog" },
            { label: "Categories", href: "/catalog/categories/list" },
            { label: "View Category" },
          ]}
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Category not found"}
        </Alert>
        <PageFooter
          backHref="/catalog/categories/list"
          backText="Back to Categories List"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Categories", href: "/catalog/categories/list" },
          { label: category.name! },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {category.name}
          </Typography>
          <Button
            component={Link}
            href={`/catalog/categories/${category.id}/edit`}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Name
                  </Typography>
                  <Typography variant="h6">{category.name}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Display Order
                  </Typography>
                  <Typography>{category.displayOrder}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Status
                  </Typography>
                  <Chip
                    label={category.active ? "Active" : "Inactive"}
                    color={category.active ? "success" : "default"}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Description
              </Typography>
              <Typography>
                {category.description || "No description"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <PageFooter
        backHref="/catalog/categories/list"
        backText="Back to Categories List"
      />
    </Box>
  );
}
