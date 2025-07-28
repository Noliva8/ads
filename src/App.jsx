import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import './App.css'; 

// Components
import Header from "./components/Layout/Header.jsx";
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import ToastNotifications from './components/ui/ToastNotifications.jsx';

// Global state
import { isLoggedInVar } from "./Apollo/cashe.js";

const App = () => {
  const location = useLocation();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Pages where header/footer should be hidden
  const authPages = [
    '/ad-account-login',
    '/ad-account-signup',
    '/verify-email',
    '/verify-phone'
  ];
  const hideLayout = authPages.includes(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
   <div className={`app-container ${hideLayout ? 'hide-layout' : ''}`}>

      {/* Header */}
      {!hideLayout && <Header />}

      <div className={`app-content ${isLoggedIn && isDashboard ? 'with-sidebar' : ''} ${hideLayout ? 'no-layout' : ''}`}>

        {/* Sidebar */}
        {isLoggedIn && isDashboard && <Sidebar />}

        {/* Main content area */}
       <main className={`main-content 
  ${isLoggedIn && isDashboard ? 'sidebar-open' : ''} 
  ${hideLayout ? 'no-padding' : ''}`}>

          <React.Suspense fallback={<LoadingSpinner fullPage />}>
            <ToastNotifications />
            <Outlet />
          </React.Suspense>
        </main>
      </div>

      {/* Footer */}
      {!isDashboard && !hideLayout && <Footer />}
    </div>
  );
};

export default App;
