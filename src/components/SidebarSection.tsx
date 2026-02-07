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
  Tooltip,
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
  onPopoverOpen?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function SidebarSection({
  title,
  icon,
  href,
  subItems,
  open,
  onToggle,
  collapsed = false,
  onPopoverOpen,
}: SidebarSectionProps) {
  const pathname = usePathname();
  const hasSubItems = subItems && subItems.length > 0;
  
  // Check if current path is this section or any of its sub-items
  const isActive = pathname === href || subItems.some((item) => pathname === item.href);

  const handleMainClick = (event: React.MouseEvent<HTMLElement>) => {
    if (collapsed && hasSubItems && onPopoverOpen) {
      // When collapsed with sub-items, show popover instead of navigating
      event.preventDefault();
      onPopoverOpen(event);
    }
    // When expanded (even with sub-items), allow normal Link navigation
    // The IconButton handles the expand/collapse separately
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  const mainButton = (
    <ListItemButton
      component={Link}
      href={href}
      onClick={handleMainClick}
      sx={{
        borderRadius: 0.25,
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
      <ListItemIcon sx={{ color: "text.primary", minWidth: collapsed ? 24 : 32 }}>
        {icon}
      </ListItemIcon>
      
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
      
      {!collapsed && hasSubItems && (
        <IconButton
          size="small"
          onClick={handleToggleClick}
          sx={{ color: "text.primary", ml: 0, p: 0.5 }}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      )}
    </ListItemButton>
  );

  return (
    <Box>
      <ListItem disablePadding>
        {collapsed ? (
          // When collapsed, wrap in tooltip
          <Tooltip title={title} placement="right" arrow>
            {mainButton}
          </Tooltip>
        ) : (
          // When expanded, no tooltip needed
          mainButton
        )}
      </ListItem>

      {/* Sub-items (only show when expanded and open) */}
      {!collapsed && hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((item) => {
              const isSubItemActive = pathname === item.href;
              
              return (
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
                    borderRadius: 0.25,
                    bgcolor: isSubItemActive ? "#E6F7FF" : "transparent",
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
                        color: isSubItemActive ? "primary.main" : "text.secondary",
                        fontSize: "0.75rem",
                        fontWeight: isSubItemActive ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
}