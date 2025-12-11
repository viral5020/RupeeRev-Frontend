import React from 'react';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { markNotificationRead } from '../../services/notificationService';
import { formatDate } from '../../utils/format';
import { Notification } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRefresh: () => Promise<any>;
}

const NotificationDrawer: React.FC<Props> = ({ open, onClose, notifications, onRefresh }) => {
  const handleMark = async (id: string) => {
    await markNotificationRead(id);
    onRefresh();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 2 }}>
        <Typography variant="h6">Notifications</Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          {notifications?.map((notification) => (
            <ListItem
              key={notification._id}
              secondaryAction={
                !notification.read && (
                  <IconButton onClick={() => handleMark(notification._id)}>
                    <CheckIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          )) || <Typography>No notifications</Typography>}
        </List>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;

