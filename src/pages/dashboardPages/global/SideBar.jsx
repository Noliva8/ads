import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from '@mui/system';

// Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";

// Custom components and utilities
import { SitemarkIcon } from "../../../components/ui/customIcon";
import userProfile from '../../../assets/images/3.svg';
import advertizerAuth from "../../../utils/advertizerAuth";
import { tokens } from "../../../theme";
import { sidebarClasses } from "../../../utils/utilityClasses";

// Styled Components
const SidebarContainer = styled(Sidebar)(({ theme, colors }) => ({
  height: '100vh',
  position: 'sticky',
  top: 0,
  transition: 'all 0.3s ease',
  boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
  
  [`.${sidebarClasses.container}`]: {
    backgroundColor: colors.blackNeutral[500],
    borderRight: 'none',
    transition: 'all 0.3s ease',
    width: '250px',
    '&.collapsed': {
      width: '80px',
    },
  },
}));

const ProfileImage = styled('img')({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid rgba(255,165,0,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(255,165,0,0.7)',
  }
});

const MenuItemStyled = styled(MenuItem)(({ theme, colors, selected }) => ({
  margin: '8px 12px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  color: selected ? colors.orange[500] : colors.graySoft[100],
  backgroundColor: selected ? 'rgba(255,165,0,0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: colors.orange[400],
    transform: 'translateX(5px)',
  },
  '& .ps-menu-icon': {
    minWidth: '36px',
    marginRight: '8px',
  }
}));

const SubMenuStyled = styled(SubMenu)(({ theme, colors }) => ({
  '& .ps-menu-button': {
    margin: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    color: colors.graySoft[100],
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: colors.orange[400],
    },
  },
  '& .ps-submenu-content': {
    backgroundColor: colors.blackNeutral[600],
    marginLeft: '12px',
    borderLeft: `2px solid ${colors.orange[500]}`,
  }
}));

const CollapseButton = styled(IconButton)(({ theme, colors }) => ({
  position: 'absolute',
  right: '-15px',
  top: '20px',
  backgroundColor: colors.orange[500],
  color: 'white',
  zIndex: 1000,
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: colors.orange[600],
  }
}));

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <MenuItemStyled
      selected={selected === title}
      colors={colors}
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography variant="body1" fontWeight={selected === title ? 600 : 400}>
        {title}
      </Typography>
    </MenuItemStyled>
  );
};

export default function SideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const profile = advertizerAuth.getProfile();
  const fullName = profile.data.fullName;
  const company = profile.data.companyName;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SidebarContainer 
        collapsed={isCollapsed} 
        colors={colors}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            width: isCollapsed ? '80px' : '250px',
            backgroundColor: colors.blackNeutral[500],
          },
        }}
      >

{/* Header Section */}
<Box 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: '1rem',
    position: 'relative',
    minHeight: '64px',
    borderBottom: `1px solid ${colors.blackNeutral[600]}`
  }}
>
  {/* Logo/Title - Only shown when not collapsed */}
  {!isCollapsed && (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {/* Choose only one of these - either icon or text */}
        <Typography 
          variant="h5" 
          color={colors.orange[500]} 
          fontWeight={700}
          noWrap
          sx={{ 
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          Ads Afrofeel
        </Typography>
        {/* OR */}
        {/* <SitemarkIcon sx={{ fontSize: '2rem', color: colors.orange[500] }} /> */}
      </motion.div>
    </Box>
  )}

  {/* Collapse Button - Always visible */}
  <CollapseButton 
    onClick={toggleSidebar} 
    colors={colors}
    sx={{ 
      position: isCollapsed ? 'absolute' : 'static',
      right: isCollapsed ? '-15px' : '0',
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'all 0.3s ease',
      '& svg': {
        fontSize: '1.5rem' // Ensure icon visibility
      }
    }}
  >
    {isMobile ? (
      isCollapsed ? <ExpandMoreOutlinedIcon fontSize="inherit" sx={{rotate: '90degree'}} /> : <MenuOutlinedIcon fontSize="inherit" />
    ) : (
      <MenuOutlinedIcon fontSize="inherit" />
    )}
  </CollapseButton>
</Box>


<Menu 
  menuItemStyles={{
    button: {
      padding: isCollapsed ? '12px 10px' : '12px 15px',
      transition: 'all 0.3s ease',
      margin: '4px 8px',
      borderRadius: '8px',
      minWidth: isCollapsed ? '40px' : 'auto',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)',
      }
    },
  }}
>
  {/* User Profile - Only shown when not collapsed */}
  {!isCollapsed && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ textAlign: 'center', padding: '1rem', marginBottom: '1rem' }}>
        <ProfileImage
          alt="profile-user"
          src={userProfile}
        />
        <Typography
          variant="h5"
          color={colors.graySoft[100]}
          fontWeight="bold"
          sx={{ margin: '10px 0 5px 0' }}
        >
          {fullName}
        </Typography>
        <Typography variant="body1" color={colors.orange[400]}>
          {company}
        </Typography>
      </Box>
    </motion.div>
  )}

  {/* Menu Items */}
  <Box sx={{ marginTop: !isCollapsed ? '1rem' : '2rem' }}>
    {/* Main Section */}
    {!isCollapsed && (
      <Typography 
        variant="subtitle2" 
        color={colors.graySoft[400]}
        sx={{ 
          padding: '8px 16px',
          margin: '8px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Main
      </Typography>
    )}
    <Item
      title={!isCollapsed ? "Dashboard" : ""}
      to="/dashboard"
      icon={<HomeOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />

    {/* Content Section */}
    {!isCollapsed && (
      <Typography 
        variant="subtitle2" 
        color={colors.graySoft[400]}
        sx={{ 
          padding: '8px 16px',
          margin: '8px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Content
      </Typography>
    )}
    <Item
      title={!isCollapsed ? "Create Audio Ad" : ""}
      to="/dashboard/CreateAudioAd"
      icon={<AudiotrackOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />
    <Item
      title={!isCollapsed ? "Upload Overlay" : ""}
      to="/dashboard/"
      icon={<LayersOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />

    {/* Analytics Section */}
    {!isCollapsed && (
      <Typography 
        variant="subtitle2" 
        color={colors.graySoft[400]}
        sx={{ 
          padding: '8px 16px',
          margin: '8px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Analytics
      </Typography>
    )}
    <Item
      title={!isCollapsed ? "Campaigns" : ""}
      to="/dashboard/campaigns"
      icon={<CampaignOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />
    <Item
      title={!isCollapsed ? "Analytics" : ""}
      to="/dashboard/analytics"
      icon={<AnalyticsOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />

    {/* Account Section */}
    {!isCollapsed && (
      <Typography 
        variant="subtitle2" 
        color={colors.graySoft[400]}
        sx={{ 
          padding: '8px 16px',
          margin: '8px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Account
      </Typography>
    )}
    <Item
      title={!isCollapsed ? "Billing" : ""}
      to="/dashboard/billing"
      icon={<ReceiptOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />
    <Item
      title={!isCollapsed ? "Help Center" : ""}
      to="/dashboard/help"
      icon={<HelpCenterOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
      selected={selected}
      setSelected={setSelected}
    />
  </Box>
</Menu>
      </SidebarContainer>
    </Box>
  );
}