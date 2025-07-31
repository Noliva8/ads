import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import { ChevronLeft, Menu } from '@mui/icons-material';
import { SidebarIcons } from './sidebarIcons';

const menuItems = [
  { text: 'Dashboard', icon: <SidebarIcons.Dashboard />, path: '/dashboard' },
  { text: 'Campaigns', icon: <SidebarIcons.Campaigns />, path: '/dashboard/campaigns' },
  { text: 'Analytics', icon: <SidebarIcons.Analytics />, path: '/dashboard/analytics' },
  { text: 'Audience', icon: <SidebarIcons.Audience />, path: '/dashboard/audience' },
  { text: 'Upload', icon: <SidebarIcons.Upload />, path: '/dashboard/upload' },
  { text: 'Billing', icon: <SidebarIcons.Billing />, path: '/dashboard/billing' },
  { text: 'Reports', icon: <SidebarIcons.Reports />, path: '/dashboard/reports' },
  { text: 'Settings', icon: <SidebarIcons.Settings />, path: '/dashboard/settings' },
];

const Sidebar = ({ collapsed = false, onToggleCollapse, onClose }) => {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        {!collapsed && <Typography variant="h6">Advertizer</Typography>}
        {onToggleCollapse && (
          <IconButton onClick={onToggleCollapse}>
            {collapsed ? <Menu /> : <ChevronLeft />}
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={onClose}
              selected={isActive}
              sx={{ pl: collapsed ? 2 : 3 }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: collapsed ? 'auto' : 2 }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
