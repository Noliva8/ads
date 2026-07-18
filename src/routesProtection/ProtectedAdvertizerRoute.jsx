

import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const ProtectedAdvertizerRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();
  const profileData = advertizerAuth.getProfileData(profile);

  if (!advertizerAuth.isAdvertizer()) {
    return <Navigate to="/ad-account-login" />;
  }

  if (advertizerAuth.isOwnerDashboard(profile)) {
    return <Navigate to="/owner" replace />;
  }

  if (advertizerAuth.isSuperAdminDashboard(profile)) {
    return <Navigate to="/super-admin" replace />;
  }

  if (advertizerAuth.isAdminDashboard(profile)) {
    return <Navigate to="/admin" replace />;
  }

  if (!profileData?.isConfirmed) {
    return <Navigate to="/verify-email" />;
  }

  // if (!profileData?.isPhoneConfirmed) {
  //   return <Navigate to="/verify-phone" />;
  // }

  return children;
};

export default ProtectedAdvertizerRoute;
