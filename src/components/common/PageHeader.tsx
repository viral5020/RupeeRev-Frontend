import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actionLabel, onAction, action }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
    <Typography variant="h4">{title}</Typography>
    {action && <Box>{action}</Box>}
    {!action && actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default PageHeader;

