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
