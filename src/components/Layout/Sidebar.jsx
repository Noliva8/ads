import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiTarget, 
  FiBarChart2, 
  FiUsers, 
  FiCreditCard, 
  FiSettings 
} from 'react-icons/fi';
import { Drawer, useMediaQuery } from '@mui/material';
import { brand } from '../../brand';

const Sidebar = ({ isMobile, mobileOpen, handleDrawerToggle }) => {
  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/dashboard/campaigns', icon: <FiTarget />, label: 'Campaigns' },
    { path: '/dashboard/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { path: '/dashboard/audiences', icon: <FiUsers />, label: 'Audiences' },
    { path: '/dashboard/billing', icon: <FiCreditCard />, label: 'Billing' },
    { path: '/dashboard/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e1e',
          color: 'rgba(255, 255, 255, 0.92)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        },
      }}
    >
      <div className="sidebar-brand">
        <h2>{brand.productName}</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </Drawer>
  );
};

export default Sidebar;
