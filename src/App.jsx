import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import './App.css'; 

// Components
import Header from "./components/Layout/Header.jsx";
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import ToastNotifications from './components/ui/ToastNotifications.jsx';

// main content
import AppBar from './pages/dashboardPages/global/AppBar.jsx';

// auth
import advertizerAuth from './utils/advertizerAuth.js';
// theme
import { CssBaseline,ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from './theme.js';

import SideBar from './pages/dashboardPages/global/SideBar.jsx';




const App = () => {

  const [theme, colorMode] = useMode();
 
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = advertizerAuth.isAdvertizer();
      const prof = advertizerAuth.getProfile();
      setIsLoggedIn(loggedIn);
      setProfile(prof);

      // // ✅ Only log after token is read
      // console.log("✅ Is Logged In:", loggedIn);
      // console.log("🧠 Profile structure:", prof);
    };

    checkAuth();
  }, [location.pathname]);

  const authPages = [
    '/ad-account-login',
    '/ad-account-signup',
    '/verify-email',
    '/verify-phone'
  ];
  const hideLayout = authPages.includes(location.pathname);

  return (
     <ColorModeContext.Provider value={colorMode}>

       <ThemeProvider theme={theme}>
       <CssBaseline />
       

    <div className={`app-container ${hideLayout ? 'hide-layout' : ''}`}>

      {!isDashboard && !hideLayout && <Header />}
        <main className="main-content">
          <React.Suspense fallback={<LoadingSpinner fullPage />}>
            <ToastNotifications />
            <Outlet />
          </React.Suspense>
        </main>
     
      {!isDashboard && !hideLayout && <Footer />}
    </div>
    
 </ThemeProvider>
    </ColorModeContext.Provider>
      
  );
};

export default App;


  