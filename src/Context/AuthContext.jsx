// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import advertizerAuth from '../utils/advertizerAuth';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [advertizer, setAdvertizer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = advertizerAuth.getProfile();
    setAdvertizer(profile);
    setLoading(false);
  }, []);

  const login = ({ idToken, refreshToken }) => {
    advertizerAuth.login({ idToken, refreshToken });
    const profile = advertizerAuth.getProfile();
    setAdvertizer(profile);
  };

  const logout = () => {
    advertizerAuth.logout();
    setAdvertizer(null);
  };

  const isAuthenticated = advertizerAuth.isAdvertizer();
  const isConfirmed = advertizer?.isConfirmed || false;
  const isPhoneConfirmed = advertizer?.isPhoneConfirmed || false;

  return (
    <AuthContext.Provider
      value={{
        advertizer,
        isAuthenticated,
        isConfirmed,
        isPhoneConfirmed,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
