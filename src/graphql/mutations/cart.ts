import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant {
            id
            name
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINE = gql`
  mutation UpdateCartLine($token: UUID!, $lines: [CheckoutLineUpdateInput!]!) {
    checkoutLinesUpdate(token: $token, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const REMOVE_CART_LINE = gql`
  mutation RemoveCartLine($token: UUID!, $linesIds: [ID!]!) {
    checkoutLinesDelete(token: $token, linesIds: $linesIds) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
