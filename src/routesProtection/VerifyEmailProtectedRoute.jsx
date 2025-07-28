import React from 'react';
import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const VerifyEmailProtectedRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  const isLoggedIn = advertizerAuth.isAdvertizer();
  const isEmailConfirmed = profile?.isConfirmed;

  if (!isLoggedIn) {
    return <Navigate to="/ad-account-login" replace />;
  }

  if (isEmailConfirmed) {
    // 🚫 Already confirmed, go to phone verification
    return <Navigate to="/verify-phone" replace />;
  }

  // ✅ Logged in and email not verified
  return children;
};

export default VerifyEmailProtectedRoute;
