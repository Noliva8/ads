// components/Layout/DashboardHeader.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Avatar, IconButton, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';

const DashboardHeader = () => {
  const location = useLocation();

  const pageTitle = {
    '/dashboard': 'Overview',
    '/dashboard/campaigns': 'Campaigns',
    '/dashboard/upload': 'Upload Ad',
    '/dashboard/billing': 'Billing',
    '/dashboard/settings': 'Settings',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/audience': 'Audience Insights',
    '/dashboard/help': 'Help Center',
  }[location.pathname] || 'Dashboard';




  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      px={2}
      py={1.5}
      sx={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="var(--primary-font-color)">
        {pageTitle}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: 'var(--rust)', textTransform: 'none' }}
        >
          Create Campaign
        </Button>
        <IconButton>
          <NotificationsIcon sx={{ color: 'var(--primary-font-color)' }} />
        </IconButton>
        <Avatar
          alt="Advertiser"
          src="/placeholder-avatar.jpg"
          sx={{ width: 36, height: 36 }}
        />
      </Box>
    </Box>
  );
};

export default DashboardHeader;







