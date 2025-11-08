import React from 'react';
import { Card, CardContent, CardActionArea, CardActions, Typography, Box } from '@mui/material';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface CommonCardProps {
  title: string;
  description?: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  href?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export default function CommonCard({
  title,
  description,
  icon: Icon,
  href,
  children,
  actions,
  onClick,
}: CommonCardProps) {
  const cardContent = (
    <CardContent sx={{ textAlign: "center", p: 3 }}>
      {Icon && <Icon sx={{ fontSize: 48, color: "#00b894", mb: 2 }} />}
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {children}
    </CardContent>
  );

  const card = (
    <Card sx={{ height: "100%" }}>
      {href || onClick ? (
        <CardActionArea
          component={href ? "a" : "div"}
          href={href}
          onClick={onClick}
          sx={{ height: "100%" }}
        >
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );

  return card;
}
