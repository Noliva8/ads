import { jwtDecode } from "jwt-decode";

class AdvertizerAuth {
  constructor() {
    this.tokenKey = "advertizer_id_token";
    this.refreshTokenKey = "advertizer_refresh_token";

    this._onLogin = null;
    this._onLogout = null;
  }

  // Get the decoded token payload (profile)
  getProfile() {
    try {
      const token = this.getToken();
      if (!token) return null;
      return jwtDecode(token);
    } catch (err) {
      this.clearAuth();
      return null;
    }
  }

  getProfileData(profile = this.getProfile()) {
    return profile?.data || profile || null;
  }

  // Get user role from token
  getRole() {
    const profileData = this.getProfileData();
    return profileData?.role || null;
  }

  // Check if user has specific role
  hasRole(requiredRole) {
    const role = this.getRole();
    return role === requiredRole;
  }

  isOwnerDashboard(profile = this.getProfile()) {
    const profileData = this.getProfileData(profile);
    return Boolean(
      profile?.isOwnerDashbord ||
      profile?.isOwnerDashboard ||
      profileData?.isOwnerDashbord ||
      profileData?.isOwnerDashboard ||
      (profileData?.role === "owner" && profileData?.isSuperAdmin === true)
    );
  }

  isSuperAdminDashboard(profile = this.getProfile()) {
    const profileData = this.getProfileData(profile);
    return Boolean(
      profile?.isSuperAdminDashbord ||
      profile?.isSuperAdminDashboard ||
      profileData?.isSuperAdminDashbord ||
      profileData?.isSuperAdminDashboard ||
      (profileData?.role === "admin" && profileData?.isSuperAdmin === true)
    );
  }

  isAdminDashboard(profile = this.getProfile()) {
    const profileData = this.getProfileData(profile);
    return profileData?.role === "admin" && profileData?.isSuperAdmin !== true;
  }

  getDashboardPath(profile = this.getProfile()) {
    if (this.isOwnerDashboard(profile)) {
      return "/owner";
    }

    if (this.isSuperAdminDashboard(profile)) {
      return "/super-admin";
    }

    if (this.isAdminDashboard(profile)) {
      return "/admin";
    }

    return "/dashboard";
  }

  // Check if user is authenticated as advertiser
  isAdvertizer() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  // Get stored JWT token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Store both access and refresh tokens
  setTokens({ idToken, refreshToken }) {
    localStorage.setItem(this.tokenKey, idToken);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Set Apollo state via external callback
  setOnLogin(callback) {
    this._onLogin = callback;
  }

  setOnLogout(callback) {
    this._onLogout = callback;
  }

  // Handle login - notify app and redirect
  async login({ idToken, refreshToken }) {
    this.setTokens({ idToken, refreshToken });

    const profile = this.getProfile();
    if (this._onLogin) {
      this._onLogin(profile);
    }

    window.location.assign(this.getDashboardPath(profile));
  }

  // Handle logout - notify app and redirect
  logout() {
    this.clearAuth();
    if (this._onLogout) {
      this._onLogout();
    }

    window.location.assign("/account");
  }

  // Clear all authentication data
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Silent token refresh
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      return null;
    }

    try {
      const response = await fetch(import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const { idToken, refreshToken: newRefreshToken } = await response.json();
      this.setTokens({ idToken, refreshToken: newRefreshToken });
      return idToken;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  // Get authorization header for API calls
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

const advertizerAuth = new AdvertizerAuth();

export default advertizerAuth;
