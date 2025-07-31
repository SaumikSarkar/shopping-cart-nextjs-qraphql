import { gql } from "@apollo/client";

export const GET_CHECKOUT = gql`
  query GetCheckout($token: UUID!) {
    checkout(token: $token) {
      id
      token
      email
      shippingAddress {
        firstName
        lastName
        streetAddress1
        city
        postalCode
        countryArea
        country {
          code
          country
        }
      }
      billingAddress {
        firstName
        lastName
        streetAddress1
        city
        postalCode
        countryArea
        country {
          code
          country
        }
      }
      availableShippingMethods {
        id
        name
        price {
          amount
          currency
        }
      }
      shippingMethod {
        id
        name
        price {
          amount
          currency
        }
      }
      lines {
        id
        quantity
        variant {
          id
          name
          product {
            id
            name
          }
          pricing {
            price {
              gross {
                amount
                currency
              }
            }
          }
        }
      }
      subtotalPrice {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
  }
`;
