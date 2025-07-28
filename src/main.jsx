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

const theme = createTheme({
  palette: {
    primary: {
      main: "#441a49",
    },
    secondary: {
      main: "#1a5d5d",
    },
    // ... rest of your theme
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
      { index: true, element: <GetStarted /> },
      { path: "about-ads", element: <AboutAds /> },
      { path: "account", element: <AccountInfo /> },
      { path: "Ads-campain", element: <CampaignGoals /> },
      { path: "Creative-Studio", element: <CreativeLab /> },

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
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedAdvertizerRoute>
        <DashboardLayout />
      </ProtectedAdvertizerRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      {
        path: "campaigns",
        element: <Campaigns />,
      },
      { path: "billing", element: <Billing /> },
      {
        path: "upload",
        element: <UploadAd />,
      },
      { path: "settings", element: <Settings /> },
    ],
  },

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

  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
