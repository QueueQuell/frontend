"use client";

import { useState, useEffect } from "react";
import AccountLayout from "@/components/layouts/AccountLayout";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";
import { User } from "@/lib/api/types";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<User | null>(null);

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

  const handleFieldChange = (field: keyof User, value: string) => {
    setEditedDetails((prev) => (prev ? { ...prev, [field]: value } : null));
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
            value={
              isEditing ? editedDetails?.title || "" : userDetails?.title || ""
            }
            onChange={(e) => handleFieldChange("title", e.target.value)}
            sx={{ flex: 1 }}
            slotProps={{ input: { readOnly: !isEditing } }}
          />
          <TextField
            label="First Name"
            value={
              isEditing
                ? editedDetails?.firstName || ""
                : userDetails?.firstName || ""
            }
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            sx={{ flex: 2 }}
            slotProps={{ input: { readOnly: !isEditing } }}
          />
          <TextField
            label="Last Name"
            value={
              isEditing
                ? editedDetails?.lastName || ""
                : userDetails?.lastName || ""
            }
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            sx={{ flex: 2 }}
            slotProps={{ input: { readOnly: !isEditing } }}
          />
        </Box>

        {/* Second Row: Email, Phone */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={
              isEditing ? editedDetails?.email || "" : userDetails?.email || ""
            }
            onChange={(e) => handleFieldChange("email", e.target.value)}
            slotProps={{ input: { readOnly: !isEditing } }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={
              isEditing ? editedDetails?.phone || "" : userDetails?.phone || ""
            }
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            slotProps={{ input: { readOnly: !isEditing } }}
          />
        </Box>

        {/* Address Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Address
          </Typography>
          <TextField
            fullWidth
            label="Address Line 1"
            value={
              isEditing
                ? editedDetails?.address?.addressLine1 || ""
                : userDetails?.address?.addressLine1 || ""
            }
            onChange={(e) =>
              setEditedDetails((prev) =>
                prev
                  ? {
                      ...prev,
                      address: {
                        ...(prev.address as any),
                        addressLine1: e.target.value,
                      },
                    }
                  : null,
              )
            }
            slotProps={{ input: { readOnly: !isEditing } }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Address Line 2"
            value={
              isEditing
                ? editedDetails?.address?.addressLine2 || ""
                : userDetails?.address?.addressLine2 || ""
            }
            onChange={(e) =>
              setEditedDetails((prev) =>
                prev
                  ? {
                      ...prev,
                      address: {
                        ...(prev.address as any),
                        addressLine2: e.target.value,
                      },
                    }
                  : null,
              )
            }
            slotProps={{ input: { readOnly: !isEditing } }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Street"
            value={
              isEditing
                ? editedDetails?.address?.street || ""
                : userDetails?.address?.street || ""
            }
            onChange={(e) =>
              setEditedDetails((prev) =>
                prev
                  ? {
                      ...prev,
                      address: {
                        ...(prev.address as any),
                        street: e.target.value,
                      },
                    }
                  : null,
              )
            }
            slotProps={{ input: { readOnly: !isEditing } }}
            sx={{ mb: 2 }}
          />
          {/* City, Postal Code, State, Country in one row */}
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              label="City"
              value={
                isEditing
                  ? editedDetails?.address?.city || ""
                  : userDetails?.address?.city || ""
              }
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev
                    ? {
                        ...prev,
                        address: {
                          ...(prev.address as any),
                          city: e.target.value,
                        },
                      }
                    : null,
                )
              }
              sx={{ flex: 2 }}
              slotProps={{ input: { readOnly: !isEditing } }}
            />
            <TextField
              label="Postal Code"
              value={
                isEditing
                  ? editedDetails?.address?.postalCode || ""
                  : userDetails?.address?.postalCode || ""
              }
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev
                    ? {
                        ...prev,
                        address: {
                          ...(prev.address as any),
                          postalCode: e.target.value,
                        },
                      }
                    : null,
                )
              }
              sx={{ flex: 1 }}
              slotProps={{ input: { readOnly: !isEditing } }}
            />
            <TextField
              label="State"
              value={
                isEditing
                  ? editedDetails?.address?.state || ""
                  : userDetails?.address?.state || ""
              }
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev
                    ? {
                        ...prev,
                        address: {
                          ...(prev.address as any),
                          state: e.target.value,
                        },
                      }
                    : null,
                )
              }
              sx={{ flex: 1.5 }}
              slotProps={{ input: { readOnly: !isEditing } }}
            />
            <TextField
              label="Country"
              value={
                isEditing
                  ? editedDetails?.address?.country || ""
                  : userDetails?.address?.country || ""
              }
              onChange={(e) =>
                setEditedDetails((prev) =>
                  prev
                    ? {
                        ...prev,
                        address: {
                          ...(prev.address as any),
                          country: e.target.value,
                        },
                      }
                    : null,
                )
              }
              sx={{ flex: 1.5 }}
              slotProps={{ input: { readOnly: !isEditing } }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Verified:{" "}
            {isEditing
              ? editedDetails?.address?.isVerified?.toString() || "false"
              : userDetails?.address?.isVerified?.toString() || "false"}
          </Typography>
        </Box>
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
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
