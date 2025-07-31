import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

const NotificationCenter = ({ notificationsOpen, toogleNotifications }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mockNotifications = [
    {
      title: 'New message from Admin',
      subtitle: 'Click to view details',
    },
    {
      title: 'Server maintenance',
      subtitle: 'Scheduled for Sunday 2AM',
    },
    {
      title: 'New user registered',
      subtitle: 'Check user dashboard',
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={notificationsOpen}
      onClose={toogleNotifications}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          top: isMobile ? 56 : 64,
          height: `calc(100vh - ${isMobile ? 56 : 64}px)`,
          zIndex: theme.zIndex.drawer + 99,
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
        },
      }}
    >
      <List
        subheader={
          <ListSubheader
            sx={{ backgroundColor: 'inherit', color: 'var(--text-primary)' }}
          >
            Notifications
          </ListSubheader>
        }
      >
        {mockNotifications.map((notification, index) => (
          <React.Fragment key={index}>
            <ListItem button>
              <ListItemText
                primary={<Typography variant="body1">{notification.title}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {notification.subtitle}
                  </Typography>
                }
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

NotificationCenter.propTypes = {
  notificationsOpen: PropTypes.bool.isRequired,
  toogleNotifications: PropTypes.func.isRequired,
};

export default NotificationCenter;
