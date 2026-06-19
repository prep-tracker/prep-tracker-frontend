import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Paper, List, ListItem, ListItemText,
  Box, Snackbar, IconButton, Chip, Divider
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../store/notificationSlice';
import { Notification } from '../types/notification';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.notifications);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markNotificationAsRead(id)).then(() => {
      setSnackbar('Notification marked as read');
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead()).then(() => {
      setSnackbar('All notifications marked as read');
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this notification?')) {
      dispatch(deleteNotification(id)).then(() => {
        setSnackbar('Notification deleted');
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notifications</Typography>
        {items.some(n => !n.read) && (
          <Button
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No notifications found.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%' }}>
          <List sx={{ p: 0 }}>
            {items.map((n, idx) => (
              <React.Fragment key={n.id}>
                {idx > 0 && <Divider />}
                <ListItem
                  sx={{
                    bgcolor: n.read ? 'transparent' : 'action.hover',
                    py: 2,
                    px: 3,
                    transition: 'background-color 0.2s'
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!n.read && (
                        <IconButton
                          size="small"
                          color="primary"
                          title="Mark as read"
                          onClick={() => handleMarkAsRead(n.id)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        title="Delete notification"
                        onClick={() => handleDelete(n.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: n.read ? 'text.secondary' : 'primary.main' }}>
                    <InfoOutlinedIcon />
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{ fontWeight: n.read ? 500 : 700, color: n.read ? 'text.secondary' : 'text.primary' }}
                        >
                          {n.message}
                        </Typography>
                        {!n.read && (
                          <Chip label="Unread" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Container>
  );
};

export default Notifications;
