"use client";

import { useState, useEffect } from "react";
import AccountLayout from "@/components/layouts/AccountLayout";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";
import { UserDetails } from "@/lib/api/types";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      try {
        const parsed = JSON.parse(storedUserDetails);
        setUserDetails(parsed);
        setEditedDetails(parsed);
      } catch (error) {
        console.error("Error parsing userDetails from localStorage:", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedDetails) {
      setUserDetails(editedDetails);
      localStorage.setItem("userDetails", JSON.stringify(editedDetails));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDetails(userDetails);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof UserDetails, value: string) => {
    setEditedDetails(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your profile information here.
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {/* First Row: Initial, First Name, Last Name */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Initial"
            value={isEditing ? editedDetails?.initial || "" : userDetails?.initial || ""}
            onChange={(e) => handleFieldChange("initial", e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="First Name"
            value={isEditing ? editedDetails?.firstname || "" : userDetails?.firstname || ""}
            onChange={(e) => handleFieldChange("firstname", e.target.value)}
            sx={{ flex: 2 }}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Last Name"
            value={isEditing ? editedDetails?.lastname || "" : userDetails?.lastname || ""}
            onChange={(e) => handleFieldChange("lastname", e.target.value)}
            sx={{ flex: 2 }}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Box>

        {/* Second Row: Email, Phone */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={isEditing ? editedDetails?.email || "" : userDetails?.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={isEditing ? editedDetails?.phone || "" : userDetails?.phone || ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Box>

        {/* Third Row: Address */}
        <TextField
          fullWidth
          label="Address"
          value={isEditing ? editedDetails?.address || "" : userDetails?.address || ""}
          onChange={(e) => handleFieldChange("address", e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          {!isEditing ? (
            <Button variant="outlined" color="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
