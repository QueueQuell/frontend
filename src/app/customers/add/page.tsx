"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Paper, TextField, Button, Grid } from "@mui/material";
import Link from "next/link";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function AddCustomerPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Customer
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="First Name" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Address" multiline rows={3} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Notes" multiline rows={2} variant="outlined" />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" startIcon={<PersonAddIcon />}>
              Add Customer
            </Button>
            <Button component={Link} href="/customers/list" variant="outlined">
              Cancel
            </Button>
          </Box>
        </Paper>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/customers" variant="outlined">
            ← Back to Customers
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
