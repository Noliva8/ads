

import { makeVar, InMemoryCache } from '@apollo/client';
import advertizerAuth from '../utils/advertizerAuth';

// Reactive variable to track login status
export const isLoggedInVar = makeVar(advertizerAuth.isAdvertizer());

// Reactive variable to hold user profile data
export const userDataVar = makeVar(() => {
  const profile = advertizerAuth.getProfile();
  return profile
    ? {
        id: profile.sub || profile.id,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || 'advertiser',
        avatar: profile.picture || profile.avatar || ''
      }
    : null;
})();

// Apollo Cache configuration
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
