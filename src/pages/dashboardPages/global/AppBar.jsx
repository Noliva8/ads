import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../../../theme';
import { brand } from '../../../brand';

// Icons
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';

// Extract advert profile to check if he is an owner or not and then display the appropriate menu. 
import advertizerAuth from '../../../utils/advertizerAuth.js';

export default function AppBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // Get decoded token/profile from the advertizer auth util.
  const profile = advertizerAuth.getProfile();

  const isOwner = advertizerAuth.isOwnerDashboard(profile);
  const isSuperAdmin = advertizerAuth.isSuperAdminDashboard(profile);
  const isAdmin = advertizerAuth.isAdminDashboard(profile);
  const userRole = isOwner ? 'owner' : isSuperAdmin ? 'super-admin' : isAdmin ? 'admin' : 'advertizer';
  const roleLabel = isOwner ? 'Owner' : isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Advertiser';

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
      p={2}
      data-user-role={userRole}
    >
      <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" sx={{ minWidth: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          backgroundColor={brand.colors.cardSurface}
          border={`1px solid ${brand.colors.cardBorder}`}
          borderRadius={brand.radius.md}
          px={1}
          sx={{ width: { xs: '100%', sm: 280 }, maxWidth: '100%' }}
        >
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search…" />
          <IconButton aria-label="search">
            <SearchOutlined />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.25,
            py: 0.5,
            borderRadius: brand.radius.pill,
            border: `1px solid ${brand.colors.accent}`,
            color: brand.colors.accent,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {roleLabel}
        </Box>
      </Box>

      {/* Icon buttons */}
      <Box display="flex" alignItems="center" gap='2px' sx={{ ml: 'auto' }}>
        <IconButton onClick={colorMode.toggleColorMode} aria-label="toggle theme">
          {theme.palette.mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>
        <IconButton aria-label="notifications">
          <NotificationsOutlined />
        </IconButton>
        <IconButton aria-label="settings">
          <SettingsOutlined />
        </IconButton>
        <IconButton aria-label="profile">
          <PersonOutlined />
        </IconButton>
      </Box>

      
    </Box>
  );
}
