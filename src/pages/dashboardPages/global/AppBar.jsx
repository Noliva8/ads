import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../../../theme';

// Icons
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';

export default function AppBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search bar */}
      <Box
        display="flex"
        alignItems="center"
        backgroundColor={colors.blackAccent[400]}
        borderRadius="3px"
        px={1}
      >
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search…" />
        <IconButton aria-label="search">
          <SearchOutlined />
        </IconButton>
      </Box>

      {/* Icon buttons */}
      <Box display="flex" alignItems="center" gap='2px'>
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
