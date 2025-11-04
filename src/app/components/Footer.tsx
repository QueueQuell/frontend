import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        p: 1.5,
        borderTop: 1,
        borderColor: "divider",
        textAlign: "center",
        bgcolor: "background.paper",
        boxShadow: 1,
        color: "text.primary",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        © {new Date().getFullYear()} QueueQuell — Built with Next.js
      </Typography>
    </Box>
  );
}
