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
import { usePathname } from "next/navigation";
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
  collapsed?: boolean;
}

export default function SidebarSection({
  title,
  icon,
  href,
  subItems,
  open,
  onToggle,
  collapsed = false,
}: SidebarSectionProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Box>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href={href}
          sx={{
            borderRadius: 2,
            bgcolor: isActive ? "#E6F7FF" : "transparent",
            borderLeft: isActive ? "4px solid #00B4FF" : "none",
            "&:hover": {
              bgcolor: "#E6F7FF",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            transition: "all 0.3s ease",
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 1 : 2,
          }}
        >
          <ListItemIcon sx={{ color: "text.primary", minWidth: collapsed ? 24 : 32 }}>{icon}</ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={title}
              sx={{
                "& .MuiListItemText-primary": {
                  color: "text.primary",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.8rem",
                },
              }}
            />
          )}
          {!collapsed && subItems.length > 0 && (
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
          )}
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
                    fontSize: "0.75rem",
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
