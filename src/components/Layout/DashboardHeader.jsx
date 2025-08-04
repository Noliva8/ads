import { useState } from 'react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

const DashboardHeader = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div className="header-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search campaigns, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-notification">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <img src="/default-profile.jpg" alt="User profile" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;