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