import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f1f3f5",
        borderTop: "1px solid #e6e6e6",
        p: 1.5,
        textAlign: "center",
        fontSize: "0.8rem",
        color: "#777",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        © {new Date().getFullYear()} QueueQuell — Built with Next.js
      </Typography>
    </Box>
  );
}
