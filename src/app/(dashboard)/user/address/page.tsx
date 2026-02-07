import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

export default function AddressPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Address
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your addresses here.
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Street Address"
              defaultValue="123 Main Street"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="City" defaultValue="New York" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="State" defaultValue="NY" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="ZIP Code" defaultValue="10001" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Country" defaultValue="United States" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant="contained" color="primary">
              Save Address
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
