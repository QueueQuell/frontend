"use client";

import { Alert, Snackbar, SnackbarProps } from "@mui/material";

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarProps["anchorOrigin"];
}

export default function SnackbarAlert({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
}: SnackbarAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
