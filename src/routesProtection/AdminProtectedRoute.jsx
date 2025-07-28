

import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const AdminProtectedRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  if (!advertizerAuth.isAdvertizer()) {
    return <Navigate to="/ad-account-login" />;
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/not-authorized" />; // or redirect elsewhere
  }

  return children;
};

export default AdminProtectedRoute;
