"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import BusinessIcon from "@mui/icons-material/Business";

export default function AddSupplierPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Supplier
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }} >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Supplier Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Company Name" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category">
                      <MenuItem value="vegetables">Vegetables</MenuItem>
                      <MenuItem value="meat">Meat</MenuItem>
                      <MenuItem value="dairy">Dairy</MenuItem>
                      <MenuItem value="beverages">Beverages</MenuItem>
                      <MenuItem value="bakery">Bakery</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField fullWidth label="Contact Person" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField fullWidth label="Email" type="email" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField fullWidth label="Phone" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField fullWidth label="Address" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }} >
                  <TextField fullWidth label="Notes" multiline rows={3} variant="outlined" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button variant="contained" fullWidth startIcon={<BusinessIcon />}>
                  Add Supplier
                </Button>
              </Box>
              <Button variant="outlined" fullWidth>
                Save as Draft
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/suppliers" variant="outlined">
            ← Back to Suppliers
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
