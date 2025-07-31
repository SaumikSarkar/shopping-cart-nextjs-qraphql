import { gql } from "@apollo/client";

export const GET_CHECKOUT = gql`
  query GetCheckout($token: UUID!) {
    checkout(token: $token) {
      id
      token
      email
      lines {
        id
        quantity
        variant {
          id
          name
          product {
            id
            name
            slug
            thumbnail {
              url
            }
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
