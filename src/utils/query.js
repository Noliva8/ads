import { gql } from "@apollo/client";


export const MY_ADS = gql`

query MyAds($limit: Int, $offset: Int) {
  myAds(limit: $limit, offset: $offset) {
    adTitle
    adType
    
    id
    status
    targeting {
      city
      countries
      scope
      state
      wholeCountry
    }
  }
}
`


export const ARTIST_DASHBOARD_STATS = gql`
  query ArtistDashboardStats {
    artistDashboardStats {
      total
      thisWeek
    }
  }
`;


export const SONGS_DASHBOARD_STATS = gql`
  query SongsDashboardStats {
    songsDashboardStats {
      total
      thisWeek
    }
  }
`;

export const USERS_DASHBOARD_STATS = gql`
  query UsersDashboardStats {
    usersDashboardStats {
      total
      thisWeek
    }
  }
`;

export const PLAYS_DASHBOARD_STATS = gql`
  query PlaysDashboardStats {
    playsDashboardStats {
      total
      thisWeek
      previousWeek
      changePercent
    }
  }
`;

export const VISITOR_ANALYTICS_STATS = gql`
  query VisitorAnalyticsStats {
    visitorAnalyticsStats {
      totalVisitors
      newVisitors
      returningVisitors
      anonymousVisitors
      convertedVisitors
      eligibleAnonymousVisitors
      conversionRate
      totalVisits
      busiestDay
      busiestDayVisits
      dailyVisits {
        date
        label
        visits
        uniqueVisitors
      }
    }
  }
`;
