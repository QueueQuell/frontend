import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { RestaurantMenu } from "@mui/icons-material";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

interface MenuCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export default function MenuCategories({
  categories,
  selectedCategory,
  onCategorySelect,
}: MenuCategoriesProps) {
  return (
    <Box
      sx={{
        width: 200,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
        Categories
      </Typography>
      <Divider />
      <List>
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <ListItem key={category.id} disablePadding>
              <ListItemButton
                selected={selectedCategory === category.id}
                onClick={() => onCategorySelect(category.id)}
              >
                <IconComponent sx={{ mr: 1 }} />
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
