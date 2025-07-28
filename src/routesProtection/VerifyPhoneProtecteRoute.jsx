import React from 'react';
import { Navigate } from 'react-router-dom';
import advertizerAuth from '../utils/advertizerAuth';

const VerifyPhoneProtectedRoute = ({ children }) => {
  const profile = advertizerAuth.getProfile();

  const isLoggedIn = advertizerAuth.isAdvertizer();
  const isEmailConfirmed = profile?.isConfirmed;
  const isPhoneVerified = profile?.isPhoneVerified;

  if (!isLoggedIn) {
    return <Navigate to="/ad-account-login" replace />;
  }

  if (!isEmailConfirmed) {
    // 🚫 Email must be verified first
    return <Navigate to="/verify-email" replace />;
  }

  if (isPhoneVerified) {
    // 🚫 Already verified phone, no need to be here
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Logged in, email verified, phone NOT verified
  return children;
};

export default VerifyPhoneProtectedRoute;
