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

export const ONLINE_USER_PRESENCE_STATS_UPDATED = gql`
  subscription OnlineUserPresenceStatsUpdated {
    onlineUserPresenceStatsUpdated {
      totalOnline
      uploading
      playing
      browsing
    }
  }
`;






export const DASHBOARD_ARTISTS = gql`
  query DashboardArtists($page: Int = 1) {
    dashboardArtists(page: $page) {
      artists {
        id
        _id
        fullName
        artistAka
        email
        region
        country
        isProfileComplete
        isVerified
        createdAt
      }
      page
      limit
      totalArtists
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;


export const ARTIST_PROFILE = gql`
query ArtistProfile($artistId: ID) {
  artistProfile(artistId: $artistId) {
    _id
    artistAka
    bio
    country
    region
    coverImage
    createdAt
    email
    fullName
    isProfileComplete
    followers {
      _id
    }
    genre
    languages
    mood
    profileImage
    bookingAvailability
    songs {
      _id
      title
    }
  }
}
`




export const ADMIN_SONGS = gql`
  query AdminSongs(
    $limit: Int = 50
    $offset: Int = 0
    $search: String
    $visibility: String
    $uploadStatus: String
  ) {
    adminSongs(
      limit: $limit
      offset: $offset
      search: $search
      visibility: $visibility
      uploadStatus: $uploadStatus
    ) {
      totalCount
      hasNextPage
      hasPreviousPage
      songs {
        _id
        title
        createdAt
        releaseDate
        visibility
        songUploadStatus
        featuringArtist
        songCategory
        speed
        artwork
        audioFileUrl
        streamAudioFileUrl
        premiumStreamAudioFileUrl
        genre
        mood
        subMoods
        label
        trackNumber
        lyrics
        producer {
          name
          role
        }
        composer {
          name
          contribution
        }
        artist {
          _id
          artistAka
          fullName
          email
          country
          profileImage
        }
        album {
          _id
          title
          releaseDate
          albumCoverImage
        }
      }
    }
  }
`;


export const GET_ALBUM = gql`
query albumOfArtist($artistId: ID){
  albumOfArtist(artistId: $artistId) {
    _id
    title
  }
}
`
