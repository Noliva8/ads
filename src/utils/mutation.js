
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


