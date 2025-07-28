

import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const ProtectedAdvertizerRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  if (!advertizerAuth.isAdvertizer()) {
    return <Navigate to="/ad-account-login" />;
  }

  if (!profile?.isConfirmed) {
    return <Navigate to="/verify-email" />;
  }

  // if (!profile?.isPhoneConfirmed) {
  //   return <Navigate to="/verify-phone" />;
  // }

  return children;
};

export default ProtectedAdvertizerRoute;
