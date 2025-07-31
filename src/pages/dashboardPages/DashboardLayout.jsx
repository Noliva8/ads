import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, Drawer, IconButton } from '@mui/material';
import DashboardHeader from '../../components/Layout/DashboardHeader';
import Sidebar from '../../components/Layout/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 72;

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCollapseToggle = () => setCollapsed(!collapsed);

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar (mobile as temporary, desktop as permanent) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            },
          }}
        >
          <Sidebar onClose={handleDrawerToggle} collapsed={false} />
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: currentWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: currentWidth,
              transition: 'width 0.3s',
              overflowX: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            },
          }}
        >
          <Sidebar collapsed={collapsed} onToggleCollapse={handleCollapseToggle} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DashboardHeader>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </DashboardHeader>

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
