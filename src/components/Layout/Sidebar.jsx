import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Divider, styled } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  Payment as PaymentIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const SidebarContainer = styled('div')({
  width: '240px',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  paddingTop: '64px', // header height
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--primary-font-color)',
});

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  '&.Mui-selected': {
    backgroundColor: 'var(--rust)',
    '&:hover': {
      backgroundColor: 'var(--rust-hover)',
    }
  },
  '&:hover': {
    backgroundColor: 'var(--bg-primary)',
  }
}));

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/dashboard/campaigns' },
    { text: 'Billing', icon: <PaymentIcon />, path: '/dashboard/billing' },
    { text: 'Upload Ad', icon: <UploadIcon />, path: '/dashboard/upload' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  return (
    <SidebarContainer>
      <List>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: 'var(--gold)' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: 'var(--border-color)' }} />
    </SidebarContainer>
  );
};

export default Sidebar;