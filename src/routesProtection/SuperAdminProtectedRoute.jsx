import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const SuperAdminProtectedRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  if (!advertizerAuth.isAdvertizer()) {
    return <Navigate to="/ad-account-login" />;
  }

  if (!advertizerAuth.isSuperAdminDashboard(profile)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
