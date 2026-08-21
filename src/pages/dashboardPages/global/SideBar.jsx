import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import { styled } from '@mui/system';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import { SitemarkIcon } from "../../../components/ui/customIcon";
import userProfile from '../../../assets/images/3.svg';
import advertizerAuth from "../../../utils/advertizerAuth";
import { tokens } from "../../../theme";
import { brand, getRoleBrandTheme } from "../../../brand";
import { sidebarClasses } from "../../../utils/utilityClasses";

const getRoleTheme = (isOwner, isSuperAdmin, isAdmin, colors) => {
  return getRoleBrandTheme({ isOwner, isSuperAdmin, isAdmin }) || {
    accent: brand.colors.accent,
    accentSoft: brand.colors.accentSoft,
    surface: brand.gradients.dashboard,
    selectedBg: brand.roleThemes.advertiser.selectedBg,
    selectedText: brand.colors.accentHover,
    hoverText: brand.colors.accentHover,
    badgeText: brand.colors.accentHover,
    border: brand.colors.accent,
  };
};

const getPermissionRoute = (permissionKey, sectionLabel, dashboardBase) => {
  const normalizedSection = sectionLabel?.toLowerCase() || "";

  if (normalizedSection.includes("admin")) {
    return dashboardBase === "/owner" ? "/owner/manage-admins" : dashboardBase;
  }

  if (normalizedSection.includes("advertiser")) {
    return dashboardBase === "/owner" ? "/owner/manage-advertisers" : `${dashboardBase}/manage-adverts`;
  }

  if (normalizedSection.includes("ad")) {
    return dashboardBase === "/owner" ? "/owner/manage-ads" : `${dashboardBase}/manage-adverts`;
  }

  if (normalizedSection.includes("song") || normalizedSection.includes("artist")) {
    return dashboardBase === "/owner" ? dashboardBase : `${dashboardBase}/manage-songs`;
  }

  if (normalizedSection.includes("setting")) {
    return `${dashboardBase}/settings`;
  }

  if (normalizedSection.includes("report")) {
    return dashboardBase;
  }

  if (normalizedSection.includes("user")) {
    return dashboardBase;
  }

  if (permissionKey?.includes("settings") || permissionKey?.includes("payments") || permissionKey?.includes("categories")) {
    return `${dashboardBase}/settings`;
  }

  if (permissionKey?.includes("song") || permissionKey?.includes("artist")) {
    return dashboardBase === "/owner" ? dashboardBase : `${dashboardBase}/manage-songs`;
  }

  if (permissionKey?.includes("advertiser")) {
    return dashboardBase === "/owner" ? "/owner/manage-advertisers" : `${dashboardBase}/manage-adverts`;
  }

  if (permissionKey?.includes("ad")) {
    return dashboardBase === "/owner" ? "/owner/manage-ads" : `${dashboardBase}/manage-adverts`;
  }

  return dashboardBase;
};

const getPermissionIcon = (permissionKey, sectionLabel) => {
  const key = permissionKey || "";
  const section = sectionLabel?.toLowerCase() || "";

  if (key.includes("create")) return <PersonAddAltOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (key.includes("edit") || key.includes("manage")) return <EditOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (key.includes("delete") || key.includes("reject")) return <DeleteOutlineOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (key.includes("approve")) return <BlockOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (section.includes("song") || section.includes("artist")) return <LibraryMusicOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (section.includes("setting")) return <SettingsOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
  if (section.includes("ad")) return <CampaignOutlinedIcon sx={{ fontSize: '1.4rem' }} />;

  return <PeopleOutlinedIcon sx={{ fontSize: '1.4rem' }} />;
};

const getDashboardBase = ({ isOwner, isSuperAdmin, isAdmin }) => {
  if (isOwner) return "/owner";
  if (isSuperAdmin) return "/super-admin";
  if (isAdmin) return "/admin";
  return "/dashboard";
};

const fallbackManagementSections = [
  {
    label: "Dashboard",
    permissions: [{ key: "dashboard", label: "Dashboard" }],
  },
];

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 96;

const SidebarContainer = styled(Sidebar)(({ colors, roleTheme }) => ({
  height: '100dvh',
  maxHeight: '100dvh',
  position: 'relative',
  top: 0,
  flexShrink: 0,
  transition: 'all 0.3s ease',
  borderRight: `1px solid ${brand.colors.cardBorder}`,
  [`.${sidebarClasses.container}`]: {
    background: brand.colors.dark,
    borderRight: 'none',
    transition: 'all 0.3s ease',
    height: '100dvh',
    maxHeight: '100dvh',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: `${brand.colors.borderStrong} transparent`,
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: brand.colors.borderStrong,
      borderRadius: brand.radius.pill,
    },
  },
}));




const ProfileImage = styled('img')(({ collapsed }) => ({
  width: collapsed ? '40px' : '48px',
  height: collapsed ? '40px' : '48px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `1px solid ${brand.colors.cardBorder}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: brand.colors.accent,
  }
}));

const MenuItemStyled = styled(MenuItem)(({ colors, roleTheme, selected, collapsed }) => ({
  margin: collapsed ? '4px 12px' : '4px 14px 4px 20px',
  borderRadius: brand.radius.md,
  transition: 'background-color 0.2s ease, color 0.2s ease',
  color: colors.white[100],
  backgroundColor: selected ? roleTheme.selectedBg : 'transparent',
  justifyContent: collapsed ? 'center' : 'flex-start',
  border: selected ? `1px solid ${roleTheme.border}` : '1px solid transparent',
  '&:hover': {
    backgroundColor: selected ? roleTheme.selectedBg : brand.colors.cardSurface,
    color: colors.white[100],
  },
  '& .ps-menu-icon': {
    minWidth: collapsed ? 'auto' : '36px',
    marginRight: collapsed ? '0' : '8px',
    color: selected ? roleTheme.accent : colors.whiteMuted,
  },
  '& .ps-menu-button': {
    minHeight: '40px',
  }
}));

const Item = ({ title, to, icon, selected, setSelected, collapsed, roleTheme }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItemStyled
      selected={selected === title}
      colors={colors}
      roleTheme={roleTheme}
      collapsed={collapsed}
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      {!collapsed && (
        <Typography variant="body1" fontWeight={selected === title ? 600 : 400} color={colors.white[100]}>
          {title}
        </Typography>
      )}
    </MenuItemStyled>
  );
};

const SectionHeader = ({ children, icon, collapsed, open = true, onToggle, roleTheme }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const headerTheme = roleTheme || {
    accent: brand.colors.accent,
    accentSoft: brand.colors.accentSoft,
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={onToggle}
      sx={{
        width: collapsed ? 'calc(100% - 24px)' : '100%',
        border: 'none',
        background: collapsed ? brand.colors.cardSurface : 'transparent',
        borderRadius: collapsed ? brand.radius.md : 0,
        padding: collapsed ? '9px 12px' : '12px 16px 8px',
        margin: collapsed ? '14px 12px 6px' : '18px 0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: brand.colors.label,
        fontSize: '0.72rem',
        fontWeight: 800,
        textAlign: 'left',
        borderTop: collapsed ? 'none' : `1px solid ${brand.colors.cardBorder}`,
        '&:hover': {
          color: brand.colors.textPrimary,
          background: collapsed ? brand.colors.cardSurface : 'transparent',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: headerTheme.accent,
            opacity: collapsed ? 1 : 0.95,
          }}
        >
          {icon}
        </Box>
        {!collapsed && (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              '&::after': {
                content: '""',
                display: 'block',
                width: 18,
                height: 2,
                borderRadius: brand.radius.pill,
                background: headerTheme.accent,
              },
            }}
          >
            {children}
          </Box>
        )}
      </Box>
      {!collapsed && onToggle && (
        open
          ? <ExpandLessOutlinedIcon sx={{ color: colors.whiteMuted, fontSize: 18 }} />
          : <ExpandMoreOutlinedIcon sx={{ color: colors.whiteMuted, fontSize: 18 }} />
      )}
    </Box>
  );
};

export default function SideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isCompactScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const [selected, setSelected] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const profile = advertizerAuth.getProfile();
  const profileData = advertizerAuth.getProfileData(profile) || {};
  const fullName = profileData.fullName || profileData.name || "";
  const company = profileData.companyName || profileData.email || profileData.businessEmail || "";

  const isOwner = advertizerAuth.isOwnerDashboard(profile);
  const isSuperAdmin = advertizerAuth.isSuperAdminDashboard(profile);
  const isAdmin = advertizerAuth.isAdminDashboard(profile);
  const hasUserManagementAccess = isOwner || isAdmin || isSuperAdmin;
  const roleLabel = isOwner ? 'Owner' : isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Advertiser';
  const roleTheme = getRoleTheme(isOwner, isSuperAdmin, isAdmin, colors);
  const dashboardBase = getDashboardBase({ isOwner, isSuperAdmin, isAdmin });
  const permissionSections = Array.isArray(profileData.permissionSections)
    ? profileData.permissionSections.filter((section) => Array.isArray(section.permissions) && section.permissions.length > 0)
    : [];
  const managementSections = permissionSections.length > 0 ? permissionSections : fallbackManagementSections;
  const contentSectionKey = 'content';
  const analyticsSectionKey = 'analytics';
  const accountSectionKey = 'account';
  const userManagementSectionKey = 'user-management';

  const isSectionOpen = (key) => openSections[key] !== false;
  const toggleSection = (key) => {
    setOpenSections((current) => ({
      ...current,
      [key]: current[key] === false,
    }));
  };

  useEffect(() => {
    if (isCompactScreen) {
      setCollapsed(true);
    }
  }, [isCompactScreen]);

  useEffect(() => {
    const activePath = location.pathname;
    const matchingItem = [
      { label: 'Dashboard', path: dashboardBase, exact: true },
      { label: 'Create Audio Ad', path: '/dashboard/CreateAudioAd' },
      { label: 'Upload Overlay', path: '/dashboard/', exact: true },
      { label: 'Campaigns', path: '/dashboard/campaigns' },
      { label: 'Analytics', path: '/dashboard/analytics' },
      { label: 'Billing', path: '/dashboard/billing' },
      { label: 'Help Center', path: '/dashboard/help' },
    ].find((item) => activePath === item.path || (!item.exact && activePath.startsWith(item.path)));

    if (matchingItem) {
      setSelected(matchingItem.label);
    }
  }, [location.pathname, dashboardBase]);

  return (
    <Box
      sx={{
        flex: `0 0 ${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH}px`,
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        minWidth: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        transition: 'width 0.3s ease, flex-basis 0.3s ease, min-width 0.3s ease',
      }}
    >
      <SidebarContainer
        collapsed={collapsed}
        colors={colors}
        roleTheme={roleTheme}
        width={`${SIDEBAR_WIDTH}px`}
        collapsedWidth={`${SIDEBAR_COLLAPSED_WIDTH}px`}
        rootStyles={{
          width: collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
          minWidth: collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
          [`.${sidebarClasses.container}`]: {
            width: collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
            background: brand.colors.dark,
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            padding: '1rem 1rem 1.25rem',
            position: 'relative',
            minHeight: '84px',
            borderBottom: `1px solid ${brand.colors.cardBorder}`
          }}
        >
          {!collapsed ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SitemarkIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{ color: colors.white[100], fontWeight: 800, lineHeight: 1.05 }}
                  noWrap
                >
                  {brand.productName}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: 1 }} />
          )}
          <IconButton
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            size="small"
            sx={{
              color: colors.white[100],
              backgroundColor: brand.colors.cardSurface,
              border: `1px solid ${brand.colors.cardBorder}`,
              '&:hover': { backgroundColor: brand.colors.accentSoft },
            }}
          >
            <MenuOutlinedIcon fontSize="small" sx={{ color: colors.white[100] }} />
          </IconButton>
        </Box>

        <Menu
          menuItemStyles={{
            button: {
              padding: collapsed ? '10px 12px' : '10px 14px',
              transition: 'all 0.3s ease',
              margin: 0,
              borderRadius: brand.radius.md,
              minWidth: 'auto',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: brand.colors.cardSurface,
              }
            },
          }}
        >
          {!collapsed && (
            <Box
              sx={{
                px: 2,
                pt: 2,
                pb: 1,
                color: brand.colors.label,
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Profile
            </Box>
          )}
          <Box
            sx={{
              mx: 1.5,
              mt: collapsed ? 1.5 : 0,
              mb: collapsed ? 1.75 : 4,
              p: collapsed ? 1 : 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              borderRadius: brand.radius.md,
              background: brand.colors.cardSurface,
              border: `1px solid ${brand.colors.cardBorder}`,
              minHeight: collapsed ? 58 : 72,
              overflow: 'hidden',
            }}
          >
            <ProfileImage
              alt="profile-user"
              src={userProfile}
              collapsed={collapsed ? 1 : 0}
            />
            {!collapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  color={colors.white[100]}
                  fontWeight={700}
                  sx={{ lineHeight: 1.2 }}
                  noWrap
                >
                  {fullName || 'Advertiser'}
                </Typography>
                <Typography variant="caption" color={colors.whiteMuted} noWrap display="block">
                  {company}
                </Typography>
                <Box
                  sx={{
                    mt: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: brand.radius.pill,
                    border: `1px solid ${roleTheme.border}`,
                    color: roleTheme.badgeText,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {roleLabel}
                </Box>
              </Box>
            )}
          </Box>

          {!collapsed && (
            <Box
              sx={{
                px: 2,
                pt: 2,
                pb: 0.75,
                color: brand.colors.label,
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderTop: `1px solid ${brand.colors.cardBorder}`,
              }}
            >
              Navigation
            </Box>
          )}

          <Box sx={{ marginTop: collapsed ? '0.75rem' : 0 }}>
            {!hasUserManagementAccess && (
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                selected={selected}
                setSelected={setSelected}
                collapsed={collapsed}
                roleTheme={roleTheme}
              />
            )}

            {hasUserManagementAccess && (
              <>
                {isSectionOpen(userManagementSectionKey) && (
                  <Item
                    title="Dashboard"
                    to={dashboardBase}
                    icon={<HomeOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                    selected={selected}
                    setSelected={setSelected}
                    collapsed={collapsed}
                    roleTheme={roleTheme}
                  />
                )}
                {managementSections.map((section) => {
                  const sectionKey = section.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const sectionIcon = getPermissionIcon(section.permissions[0]?.key, section.label);

                  return (
                    <Box key={section.label} component="section">
                      <SectionHeader
                        icon={sectionIcon}
                        collapsed={collapsed}
                        open={isSectionOpen(sectionKey)}
                        onToggle={() => toggleSection(sectionKey)}
                        roleTheme={roleTheme}
                      >
                        {section.label}
                      </SectionHeader>
                      {isSectionOpen(sectionKey) && section.permissions.map((permission) => (
                        <Item
                          key={permission.key}
                          title={permission.label}
                          to={getPermissionRoute(permission.key, section.label, dashboardBase)}
                          icon={getPermissionIcon(permission.key, section.label)}
                          selected={selected}
                          setSelected={setSelected}
                          collapsed={collapsed}
                          roleTheme={roleTheme}
                        />
                      ))}
                    </Box>
                  );
                })}
              </>
            )}

            {!hasUserManagementAccess && (
              <>
                <SectionHeader
                  icon={<AudiotrackOutlinedIcon sx={{ fontSize: '1.1rem' }} />}
                  collapsed={collapsed}
                  open={isSectionOpen(contentSectionKey)}
                  onToggle={() => toggleSection(contentSectionKey)}
                  roleTheme={roleTheme}
                >
                  Content
                </SectionHeader>
                {isSectionOpen(contentSectionKey) && (
                  <>
                    <Item
                      title="Create Audio Ad"
                      to="/dashboard/CreateAudioAd"
                      icon={<AudiotrackOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                    <Item
                      title="Upload Overlay"
                      to="/dashboard/"
                      icon={<LayersOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                  </>
                )}
                <SectionHeader
                  icon={<AnalyticsOutlinedIcon sx={{ fontSize: '1.1rem' }} />}
                  collapsed={collapsed}
                  open={isSectionOpen(analyticsSectionKey)}
                  onToggle={() => toggleSection(analyticsSectionKey)}
                  roleTheme={roleTheme}
                >
                  Analytics
                </SectionHeader>
                {isSectionOpen(analyticsSectionKey) && (
                  <>
                    <Item
                      title="Campaigns"
                      to="/dashboard/campaigns"
                      icon={<CampaignOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                    <Item
                      title="Analytics"
                      to="/dashboard/analytics"
                      icon={<AnalyticsOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                  </>
                )}

                <SectionHeader
                  icon={<ReceiptOutlinedIcon sx={{ fontSize: '1.1rem' }} />}
                  collapsed={collapsed}
                  open={isSectionOpen(accountSectionKey)}
                  onToggle={() => toggleSection(accountSectionKey)}
                  roleTheme={roleTheme}
                >
                  Account
                </SectionHeader>
                {isSectionOpen(accountSectionKey) && (
                  <>
                    <Item
                      title="Billing"
                      to="/dashboard/billing"
                      icon={<ReceiptOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                    <Item
                      title="Help Center"
                      to="/dashboard/help"
                      icon={<HelpCenterOutlinedIcon sx={{ fontSize: '1.4rem' }} />}
                      selected={selected}
                      setSelected={setSelected}
                      collapsed={collapsed}
                      roleTheme={roleTheme}
                    />
                  </>
                )}
              </>
            )}
          </Box>
        </Menu>
      </SidebarContainer>
    </Box>
  );
}
