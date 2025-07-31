import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import client from "./Apollo/client";

// Public pages
import ErrorPage from "./pages/public/ErrorPage";
import GetStarted from "./pages/public/GetStarted";
import AboutAds from "./pages/public/AboutAds";
import AccountInfo from "./pages/public/AccountInfo";
import CampaignGoals from "./pages/public/CampainGoals";
import CreativeLab from "./pages/public/CreativeLab";
import CreateAdAccount from "./pages/adsAuth/CreateAdAccount";
import AdAccountLogin from "./pages/adsAuth/AdAccountLogin";

// Dashboard pages
import DashboardLayout from "./pages/dashboardPages/DashboardLayout";
import Overview from "./pages/dashboardPages/Overview";
import Campaigns from "./pages/dashboardPages/Campaigns";
import Billing from "./pages/dashboardPages/Billing";
import UploadAd from "./pages/dashboardPages/UploadAd";
import Settings from "./pages/dashboardPages/Settings";
import NotFound from "./pages/dashboardPages/NotFound";
import VerifyPhone from "./pages/adsAuth/VerifyPhone";
import VerifyEmail from "./pages/adsAuth/VerifyEmail";
import ResendVerifyEmail from "./pages/adsAuth/resendVerifyEmail";
import AudienceInsights from "./pages/dashboardPages/AudienceInsights";
import HelpCenter from "./pages/dashboardPages/HelpCenter";

// Admin pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminManage from "./pages/Admin/SubAdminPages/AdminManage";
import AdminSettings from "./pages/Admin/SubAdminPages/AdminSettings";

// Context Providers
import { AuthProvider } from "./Context/AuthContext";
// import { AdProvider } from './context/AdContext';
// import { CampaignProvider } from './context/CampaignContext';

// Advertizer auth
import advertizerAuth from "./utils/advertizerAuth";
import { isLoggedInVar, userDataVar } from "./Apollo/cashe";

// Route protections
import ProtectedAdvertizerRoute from "./routesProtection/ProtectedAdvertizerRoute";
import AdminProtectedRoute from "./routesProtection/AdminProtectedRoute";
import VerifyEmailProtectedRoute from "./routesProtection/VerifyEmailProtectedRoute";
import VerifyPhoneProtecteRoute from "./routesProtection/VerifyPhoneProtecteRoute";

// Analytics
import Analytics from "./components/Analytics/analytics";

// Lazy loaded components for better performance
const LazyPricing = React.lazy(() => import("./pages/public/Pricing"));
const LazySupport = React.lazy(() => import("./pages/public/Support"));

import { CssBaseline } from "@mui/material";



const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#441a49',
    },
    secondary: {
      main: '#1a5d5d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.92)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
});




// 🔗 Register the Apollo updaters
advertizerAuth.setOnLogin((profile) => {
  isLoggedInVar(true);
  userDataVar({
    id: profile.sub || profile.id,
    name: profile.name || "",
    email: profile.email,
    role: profile.role,
    avatar: profile.picture || profile.avatar || "",
  });
});

advertizerAuth.setOnLogout(() => {
  isLoggedInVar(false);
  userDataVar(null);
});

// Optional: sync on page load
const existingProfile = advertizerAuth.getProfile();
if (existingProfile) {
  isLoggedInVar(true);
  userDataVar({
    id: existingProfile.sub || existingProfile.id,
    name: existingProfile.name || "",
    email: existingProfile.email,
    role: existingProfile.role,
    avatar: existingProfile.picture || existingProfile.avatar || "",
  });
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // 🌟 Public pages
      { index: true, element: <GetStarted /> },
      { path: "about-ads", element: <AboutAds /> },
      { path: "account", element: <AccountInfo /> },
      { path: "Ads-campain", element: <CampaignGoals /> },
      { path: "Creative-Studio", element: <CreativeLab /> },

      // 🌟 Auth pages
      { path: "ad-account-login", element: <AdAccountLogin /> },
      { path: "ad-account-signup", element: <CreateAdAccount /> },
      {
        path: "verify-email",
        element: (
          <VerifyEmailProtectedRoute>
            <VerifyEmail />
          </VerifyEmailProtectedRoute>
        ),
      },
      { path: "verify-phone", element: <VerifyPhone /> },
      { path: "resend-email-verification-link", element: <ResendVerifyEmail /> },

      // 🌟 Lazy-loaded pages
      {
        path: "pricing",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyPricing />
          </React.Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazySupport />
          </React.Suspense>
        ),
      },

      // ✅ DASHBOARD (now nested inside /)
      {
        path: "dashboard",
        element: (
          <ProtectedAdvertizerRoute>
            <DashboardLayout />
          </ProtectedAdvertizerRoute>
        ),
        children: [
          { index: true, element: <Overview /> },
          { path: "campaigns", element: <Campaigns /> },
          { path: "billing", element: <Billing /> },
          { path: "upload", element: <UploadAd /> },
          { path: "settings", element: <Settings /> },
          {
  path: "analytics",
  element: <Analytics />,
},
{
  path: "audience",
  element: <AudienceInsights />,
},
{
  path: "help",
  element: <HelpCenter />,
},



        ],
      },
    ],
  },

  // ✅ Admin remains outside
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "manage", element: <AdminManage /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },

  // 🔥 Catch-all 404
  {
    path: "*",
    element: <NotFound />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
       <CssBaseline />
      <ApolloProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
