import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const OwnerProtectedRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  if (!advertizerAuth.isAdvertizer()) {
    return <Navigate to="/ad-account-login" />;
  }

  if (!advertizerAuth.isOwnerDashboard(profile)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default OwnerProtectedRoute;
