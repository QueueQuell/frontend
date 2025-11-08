import AccountLayout from "../../components/layouts/AccountLayout";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";

export default function ProfilePage() {
    return (
        <AccountLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    User Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Manage your profile information here.
                </Typography>
                <Paper sx={{ p: 3, maxWidth: 600 }}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue="John Doe"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        defaultValue="+1 (555) 123-4567"
                        sx={{ mb: 3 }}
                    />
                    <Button variant="contained" color="primary">
                        Save Changes
                    </Button>
                </Paper>
            </Box>
        </AccountLayout>
    );
}
