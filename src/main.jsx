import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";

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
// import AdsDashboardLayout from "./pages/dashboardPages/DashboardLayout";
import Dashboard from "./pages/dashboardPages/dashboard";
import Overview from "./pages/dashboardPages/overview";
import Campaigns from "./pages/dashboardPages/Campaigns";
import Billing from "./pages/dashboardPages/Billing";
import OverlayAdUpload from "./pages/dashboardPages/overlayAdUpload";
import AdPymentSuccess from "./pages/dashboardPages/adPaymentSucees";

import CreateAd from "./pages/dashboardPages/createAd";
import Settings from "./pages/dashboardPages/Settings";
import NotFound from "./pages/dashboardPages/NotFound";
import NotAuthorized from "./pages/dashboardPages/NotAuthorized";
import VerifyPhone from "./pages/adsAuth/VerifyPhone";
import VerifyEmail from "./pages/adsAuth/VerifyEmail";
import ResendVerifyEmail from "./pages/adsAuth/resendVerifyEmail";
import AudienceInsights from "./pages/dashboardPages/AudienceInsights";
import HelpCenter from "./pages/dashboardPages/HelpCenter";

// Admin pages
import AdminLayout from "./pages/Admin/AdminLayout";
import OwnerLayout from "./pages/Owner/OwnerLayout";
import SuperAdminLayout from "./pages/SuperAdmin/SuperAdminLayout";

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
import OwnerProtectedRoute from "./routesProtection/OwnerProtectedRoute";
import SuperAdminProtectedRoute from "./routesProtection/SuperAdminProtectedRoute";
import VerifyEmailProtectedRoute from "./routesProtection/VerifyEmailProtectedRoute";
import VerifyPhoneProtecteRoute from "./routesProtection/VerifyPhoneProtecteRoute";

// Analytics
import Analytics from "./components/Analytics/analytics";

// Lazy loaded components for better performance
const LazyPricing = React.lazy(() => import("./pages/public/Pricing"));
const LazySupport = React.lazy(() => import("./pages/public/Support"));
const LazyAdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));
const LazyAdminManage = React.lazy(() => import("./pages/Admin/SubAdminPages/AdminManage"));
const LazyAdminSettings = React.lazy(() => import("./pages/Admin/SubAdminPages/AdminSettings"));
const LazyAdminMetadata = React.lazy(() => import("./pages/Admin/SubAdminPages/AdminMetadata"));
const LazySuperAdminDashboard = React.lazy(() => import("./pages/SuperAdmin/SuperAdminDashboard"));
const LazyOwnerDashboard = React.lazy(() => import("./pages/Owner/OwnerDashboard"));
const LazyOwnerManageAdmins = React.lazy(() => import("./pages/Owner/SubOwnerPages/OwnerManageAdmins"));
const LazyOwnerManageAdvertisers = React.lazy(() => import("./pages/Owner/SubOwnerPages/OwnerManageAdvertisers"));
const LazyOwnerManageAds = React.lazy(() => import("./pages/Owner/SubOwnerPages/OwnerManageAds"));
const LazyOwnerSettings = React.lazy(() => import("./pages/Owner/SubOwnerPages/OwnerSettings"));

import AllArtistListPage from "./components/Commons/AllArtistList";
import AllSongsListPage from "./components/Commons/AllSongsList";









// 🔗 Register the Apollo updaters
advertizerAuth.setOnLogin((profile) => {
  const profileData = advertizerAuth.getProfileData(profile);

  isLoggedInVar(true);
  userDataVar({
    id: profileData.sub || profileData.id || profileData._id,
    name: profileData.name || profileData.fullName || "",
    email: profileData.email || profileData.businessEmail,
    role: profileData.role,
    isSuperAdmin: profileData.isSuperAdmin || false,
    avatar: profileData.picture || profileData.avatar || "",
  });
});

advertizerAuth.setOnLogout(() => {
  isLoggedInVar(false);
  userDataVar(null);
});

// Optional: sync on page load
const existingProfile = advertizerAuth.getProfile();
if (existingProfile) {
  const existingProfileData = advertizerAuth.getProfileData(existingProfile);

  isLoggedInVar(true);
  userDataVar({
    id: existingProfileData.sub || existingProfileData.id || existingProfileData._id,
    name: existingProfileData.name || existingProfileData.fullName || "",
    email: existingProfileData.email || existingProfileData.businessEmail,
    role: existingProfileData.role,
    isSuperAdmin: existingProfileData.isSuperAdmin || false,
    avatar: existingProfileData.picture || existingProfileData.avatar || "",
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
      { path: "not-authorized", element: <NotAuthorized /> },

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
            <Dashboard/>
          </ProtectedAdvertizerRoute>
        ),
        children: [
          { index: true, element: <Overview /> },
          { path: "campaigns", element: <Campaigns /> },
          { path: "billing", element: <Billing /> },
         
          { path: "CreateAudioAd", element: <CreateAd /> },
      
          { path: "upload/overlay", element: <OverlayAdUpload /> },
          

    { path: "all-artists", element: <AllArtistListPage /> },
    { path: "all-songs", element: <AllSongsListPage /> },


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

      

      






      {
  path: "adPayment/success",
  element: (
    <ProtectedAdvertizerRoute>
      <AdPymentSuccess />
    </ProtectedAdvertizerRoute>
  ),
}

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
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading admin dashboard...</div>}>
            <LazyAdminDashboard />
          </React.Suspense>
        ),
      },
      {
        path: "manage-adverts",
        element: (
          <React.Suspense fallback={<div>Loading admin adverts...</div>}>
            <LazyAdminManage />
          </React.Suspense>
        ),
      },
      {
        path: "manage-songs",
        element: <AllSongsListPage />,
      },
      { path: "all-artists", element: <AllArtistListPage /> },
      { path: "all-songs", element: <AllSongsListPage /> },
      {
        path: "metadata",
        element: (
          <React.Suspense fallback={<div>Loading admin metadata...</div>}>
            <LazyAdminMetadata />
          </React.Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <React.Suspense fallback={<div>Loading admin settings...</div>}>
            <LazyAdminSettings />
          </React.Suspense>
        ),
      },
    ],
  },

  // ✅ Super admin remains outside
  {
    path: "/super-admin",
    element: (
      <SuperAdminProtectedRoute>
        <SuperAdminLayout />
      </SuperAdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading super admin dashboard...</div>}>
            <LazySuperAdminDashboard />
          </React.Suspense>
        ),
      },
      {
        path: "manage-adverts",
        element: (
          <React.Suspense fallback={<div>Loading super admin adverts...</div>}>
            <LazyAdminManage />
          </React.Suspense>
        ),
      },
      {
        path: "manage-songs",
        element: <AllSongsListPage />,
      },
      { path: "all-artists", element: <AllArtistListPage /> },
      { path: "all-songs", element: <AllSongsListPage /> },
      {
        path: "metadata",
        element: (
          <React.Suspense fallback={<div>Loading super admin metadata...</div>}>
            <LazyAdminMetadata />
          </React.Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <React.Suspense fallback={<div>Loading super admin settings...</div>}>
            <LazyAdminSettings />
          </React.Suspense>
        ),
      },
    ],
  },

   // ✅ owner portal remains also outside
  {
    path: "/owner",
    element: (
      <OwnerProtectedRoute>
        <OwnerLayout />
      </OwnerProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading owner dashboard...</div>}>
            <LazyOwnerDashboard />
          </React.Suspense>
        ),
      },
      {
        path: "manage-admins",
        element: (
          <React.Suspense fallback={<div>Loading owner admins...</div>}>
            <LazyOwnerManageAdmins />
          </React.Suspense>
        ),
      },
      {
        path: "manage-advertisers",
        element: (
          <React.Suspense fallback={<div>Loading owner advertisers...</div>}>
            <LazyOwnerManageAdvertisers />
          </React.Suspense>
        ),
      },
      {
        path: "manage-ads",
        element: (
          <React.Suspense fallback={<div>Loading owner ads...</div>}>
            <LazyOwnerManageAds />
          </React.Suspense>
        ),
      },
      { path: "all-artists", element: <AllArtistListPage /> },
      { path: "all-songs", element: <AllSongsListPage /> },
      {
        path: "settings",
        element: (
          <React.Suspense fallback={<div>Loading owner settings...</div>}>
            <LazyOwnerSettings />
          </React.Suspense>
        ),
      },
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
   
   
      <ApolloProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ApolloProvider>
 
 
  </React.StrictMode>
);
