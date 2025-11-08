import { Box, Button } from "@mui/material";
import Link from "next/link";

interface PageFooterProps {
  backHref: string;
  backText: string;
}

export default function PageFooter({ backHref, backText }: PageFooterProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Button component={Link} href={backHref} variant="outlined">
        ← {backText}
      </Button>
    </Box>
  );
}
