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


import advertizerAuth from './utils/advertizerAuth.js';



const App = () => {
  console.log('helloo')
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

      // ✅ Only log after token is read
      console.log("✅ Is Logged In:", loggedIn);
      console.log("🧠 Profile structure:", prof);
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
    <div className={`app-container ${hideLayout ? 'hide-layout' : ''}`}>
      {!isDashboard && !hideLayout && <Header />}

      <div className={`app-content ${isLoggedIn && isDashboard ? 'with-sidebar' : ''} ${hideLayout ? 'no-layout' : ''}`}>
        {isLoggedIn && isDashboard && <Sidebar />}

        <main className={`main-content 
          ${isLoggedIn && isDashboard ? 'sidebar-open' : ''} 
          ${hideLayout ? 'no-padding' : ''}`}>

          <React.Suspense fallback={<LoadingSpinner fullPage />}>
            <ToastNotifications />
            <Outlet />
          </React.Suspense>
        </main>
      </div>

      {!isDashboard && !hideLayout && <Footer />}
    </div>
  );
};

export default App;


  