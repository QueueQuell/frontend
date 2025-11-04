import React from "react";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface SubItem {
  label: string;
  href: string;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  subItems: SubItem[];
  open: boolean;
  onToggle: () => void;
}

export default function SidebarSection({
  title,
  icon,
  href,
  subItems,
  open,
  onToggle,
}: SidebarSectionProps) {
  return (
    <Box>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href={href}
          sx={{
            borderRadius: 2,
            bgcolor: open ? "action.selected" : "transparent",
            backdropFilter: "blur(10px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "text.primary" }}>{icon}</ListItemIcon>
          <ListItemText
            primary={title}
            sx={{
              "& .MuiListItemText-primary": {
                color: "text.primary",
                fontWeight: 500,
              },
            }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            sx={{ color: "text.primary" }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                pl: 4,
                ml: 2,
                mr: 2,
                mt: 0.5,
                mb: 0.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </Box>
  );
}
