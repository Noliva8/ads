import { makeVar, InMemoryCache } from '@apollo/client';
import advertizerAuth from '../utils/advertizerAuth';

// ✅ Reactive var for login status
export const isLoggedInVar = makeVar(advertizerAuth.isAdvertizer());

// ✅ Reactive var for user profile
const profile = advertizerAuth.getProfile();
const profileData = advertizerAuth.getProfileData(profile);
export const userDataVar = makeVar(profile ? {
  id: profileData.sub || profileData.id || profileData._id || '',
  name: profileData.fullName || profileData.name || '',
  email: profileData.businessEmail || profileData.email || '',
  role: profileData.role || 'advertizer',
  isSuperAdmin: profileData.isSuperAdmin || false,
  avatar: profileData.picture || profileData.avatar || ''
} : null);

// ✅ Apollo cache setup
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        },
        currentUser: {
          read() {
            return userDataVar();
          }
        }
      }
    }
  }
});
