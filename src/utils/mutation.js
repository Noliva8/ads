import { gql } from "@apollo/client";

export const CREATE_ADVERTIZER = gql`
  mutation Mutation(
    $fullName: String!
    $companyName: String!
    $phoneNumber: String!
    $businessEmail: String!
    $password: String!
    $brandType: BrandTypes!
    $country: String!
    $companyWebsite: String
    $acceptedTerms: Boolean!
    $termsVersion: String
  ) {
    registerAdvertizer(
      fullName: $fullName
      companyName: $companyName
      phoneNumber: $phoneNumber
      businessEmail: $businessEmail
      password: $password
      brandType: $brandType
      country: $country
      companyWebsite: $companyWebsite
      acceptedTerms: $acceptedTerms
      termsVersion: $termsVersion
    ) {
      advertizerToken
      advertizer {
        _id
        fullName
        businessEmail
        isConfirmed
        isPhoneConfirmed
        role
      }
    }
  }
`;

export const RESEND_ADVERTIZER_EMAIL_TOKEN = gql`
  mutation resendAdvertizerVerificationEmail($businessEmail: ID!) {
    resendAdvertizerVerificationEmail(businessEmail: $businessEmail) {
      message
      success
    }
  }
`;

export const ADVERTIZER_LOGIN = gql`
  mutation loginAdvertizer($businessEmail: String!, $password: String!) {
    loginAdvertizer(businessEmail: $businessEmail, password: $password) {
      advertizerToken
      advertizer {
        _id
        businessEmail
        isConfirmed
        isPhoneConfirmed
        role
        companyWebsite
      }
    }
  }
`;

export const CREATE_AD = gql`
  mutation CreateAdBasic($advertiserId: ID!, $input: CreateAdBasicInput!) {
    createAdBasic(advertiserId: $advertiserId, input: $input) {
      ad {
        adTitle
        adType
        campaignId
        schedule {
          endDate
          startDate
        }
        id # Include adId (the unique identifier for the ad)
        advertiserId # Include advertiserId for reference
      }
      quote {
        basis
        cityPopulation
        currency
        days
        isMajorCity
        perDay
        totalPrice
        location {
          name
          type
          country
          city
          state
        }
        marketSize
      }
    }
  }
`;

export const CONFIRM_PRICE = gql`
  mutation ConfirmPrice(
    $adId: ID!
    $isCostConfirmed: Boolean!
    $adTitle: String!
    $campaignId: String!
    $duration: Int
    $amount: Float
    $currency: String!
    $location: String!
    $adType: String
  ) {
    confirmPrice(
      adId: $adId
      isCostConfirmed: $isCostConfirmed
      adTitle: $adTitle
      campaignId: $campaignId
      duration: $duration
      amount: $amount
      adType: $adType
      currency: $currency
      location: $location
    ) {
      id
      clientSecret
      isCostConfirmed
      amount
      currency
      location
      adId
      adType
      campaignId
    }
  }
`;

export const AUDIO_AD_UPLOAD = gql`
  mutation audioAdUpload($adId: ID!, $file: Upload!) {
    audioAdUpload(adId: $adId, file: $file) {
      id
      status
      streamingAudioAdUrl
      streamingFallBackAudioUrl
      masterAudionAdUrl
    }
  }
`;


export const AD_ARTWORK_UPLOAD =gql`
mutation uploadArtwork($adId: ID!, $file: Upload!) {
  uploadArtwork(adId: $adId, file: $file) {
    adArtWorkUrl
    id
  }
}
`

export const START_VISITOR_VISIT = gql`
  mutation StartVisitorVisit($visitorId: String!) {
    startVisitorVisit(visitorId: $visitorId) {
      visitorId
      visitId
    }
  }
`;


export const ATTACH_VISITOR_TO_USER = gql`
  mutation AttachVisitorToUser(
    $visitorId: String!
    $visitId: ID
    $isNewUser: Boolean!
  ) {
    attachVisitorToUser(
      visitorId: $visitorId
      visitId: $visitId
      isNewUser: $isNewUser
    )
  }
`;


export const ADD_BIO = gql`
mutation addBio($bio: String, $artistId: ID) {
  addBio(bio: $bio, artistId: $artistId) {
    _id
    bio
  }
}
`


export const GET_PRESIGNED_URL = gql`
mutation getPresignedUrl($bucket: String!, $key: String!, $region: String!) {
  getPresignedUrl(bucket: $bucket, key: $key, region: $region) {
    expiration
    url
  }
}
`

export const GET_PRESIGNED_URL_DELETE = gql`
mutation getPresignedUrlDelete($bucket: String!, $key: String!, $region: String!) {
  getPresignedUrlDelete(bucket: $bucket, key: $key, region: $region) {
    urlToDelete
    expiration
  }
}
`


export const GET_PRESIGNED_URL_DOWNLOAD = gql`
mutation getPresignedUrlDownload($bucket: String!, $key: String!, $region: String!) {
  getPresignedUrlDownload(bucket: $bucket, key: $key, region: $region) {
    expiration
    url
  }
}
`

export const ADD_PROFILE_IMAGE = gql`
mutation addProfileImage($profileImage: String, $artistId: ID) {
  addProfileImage(profileImage: $profileImage, artistId: $artistId) {
    _id
    profileImage
  }
}
`

export const UPDATE_ARTIST_IDENTITY = gql`
mutation UpdateArtistIdentity($fullName: String!, $artistAka: String!, $artistId: ID) {
  updateArtistIdentity(fullName: $fullName, artistAka: $artistAka, artistId: $artistId) {
    _id
    fullName
    artistAka
    email
  }
}
`


export const ADD_LANGUAGES = gql`
  mutation addLanguages($languages: [String], $artistId: ID) {
    addLanguages(languages: $languages, artistId: $artistId) {
      _id
      languages
    }
  }
`;


export const ADD_COUNTRY = gql`
  mutation AddCountry($country: String, $artistId: ID) {
    addCountry(country: $country, artistId: $artistId) {
      _id
      country
    }
  }
`;

export const ADD_REGION = gql`
  mutation AddRegion($region: String, $artistId: ID) {
    addRegion(region: $region, artistId: $artistId) {
      _id
      region
    }
  }
`;

export const ADD_GENRE = gql`
  mutation AddGenre($genre: [String], $artistId: ID) {
    addGenre(genre: $genre, artistId: $artistId) {
      _id
      genre
    }
  }
`;



export const UPDATE_SONG = gql`
  mutation UpdateSong(
    $songId: ID!
    $title: String!
    $album: ID!
    $releaseDate: Date!
    $composer: [ComposerInput]
    $producer: [ProducerInput]
    $trackNumber: Int
    $genre: String
    $songCategory: SongsCategory
    $speed: songSpead
    $featuringArtist: [String]
    $lyrics: String
    $artwork: String
    $label: String
    $mood: [String]
    $subMoods: [String]
  ) {
    updateSong(
      songId: $songId
      title: $title
      album: $album
      releaseDate: $releaseDate
      composer: $composer
      producer: $producer
      trackNumber: $trackNumber
      genre: $genre
      songCategory: $songCategory
      speed: $speed
      featuringArtist: $featuringArtist
      lyrics: $lyrics
      artwork: $artwork
      label: $label
      mood: $mood
      subMoods: $subMoods
    ) {
      _id
      songCategory
      speed
      mood
      subMoods
    }
  }
`;


export const ADD_ARTWORK = gql`
mutation addArtwork($songId: ID!, $artwork: String) {
  addArtwork(songId: $songId, artwork: $artwork) {
    _id
  }
}
`

export const ADD_LYRICS = gql`
mutation addLyrics($songId: ID!, $artistId: ID, $lyrics: String) {
  addLyrics(songId: $songId, artistId: $artistId, lyrics: $lyrics) {
    _id
  }
}
`

export const CUSTOM_ALBUM = gql`
mutation createCustomAlbum($title: String!, $artistId: ID, $releaseDate: String, $albumCoverImage: String) {
  createCustomAlbum(title: $title, artistId: $artistId, releaseDate: $releaseDate, albumCoverImage: $albumCoverImage) {
    _id
    albumCoverImage
    releaseDate
    title
    artist {
      _id
      
    }
    songs {
      _id
      title
    }
  }
}
`


export const UPDATE_ALBUM = gql`
mutation UpdateAlbum($albumId: ID!, $artistId: ID, $songId: [ID], $albumCoverImage: String) {
  updateAlbum(albumId: $albumId, artistId: $artistId, songId: $songId, albumCoverImage: $albumCoverImage) {
    title
    songs {
      _id
      title
    }
    albumCoverImage
    _id
    artist {
     
      _id
    }
    createdAt
  }
}
`
