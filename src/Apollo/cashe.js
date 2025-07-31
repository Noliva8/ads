import { makeVar, InMemoryCache } from '@apollo/client';
import advertizerAuth from '../utils/advertizerAuth';

// ✅ Reactive var for login status
export const isLoggedInVar = makeVar(advertizerAuth.isAdvertizer());

// ✅ Reactive var for user profile
const profile = advertizerAuth.getProfile();
export const userDataVar = makeVar(profile ? {
  id: profile.sub || profile.id || profile._id || '',
  name: profile.fullName || profile.name || '',
  email: profile.businessEmail || profile.email || '',
  role: profile.role || 'advertizer',
  avatar: profile.picture || profile.avatar || ''
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
