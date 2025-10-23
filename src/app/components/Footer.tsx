import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        p: 1.5,
        borderTop: "1px solid #B2DFDB",
        textAlign: "center",
        bgcolor: "#C8E6C9",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        © {new Date().getFullYear()} Restaurant Management — Built with Next.js
      </Typography>
    </Box>
  );
}
