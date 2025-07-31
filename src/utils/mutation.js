
import { gql } from '@apollo/client';



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
`


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

`