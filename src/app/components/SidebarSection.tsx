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
            borderRadius: 1,
            bgcolor: open ? "#A5D6A7" : "transparent",
            "&:hover": { bgcolor: "#A5D6A7" },
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={title} />
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((item) => (
            <ListItemButton key={item.href} component={Link} href={item.href} sx={{ pl: 4 }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </Box>
  );
}
