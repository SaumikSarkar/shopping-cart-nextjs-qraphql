import { gql } from "@apollo/client";

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(
      checkoutId: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkout {
        id
        shippingAddress {
          firstName
          lastName
          streetAddress1
          city
          postalCode
          countryArea
          country {
            code
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

export const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress($checkoutId: ID!, $billingAddress: AddressInput!) {
    checkoutBillingAddressUpdate(
      checkoutId: $checkoutId
      billingAddress: $billingAddress
    ) {
      checkout {
        id
        billingAddress {
          firstName
          lastName
          streetAddress1
          city
          postalCode
          countryArea
          country {
            code
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

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($checkoutId: ID!, $shippingMethodId: ID!) {
    checkoutShippingMethodUpdate(
      checkoutId: $checkoutId
      shippingMethodId: $shippingMethodId
    ) {
      checkout {
        id
        shippingMethod {
          id
          name
          price {
            amount
            currency
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

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($checkoutId: ID!, $paymentMethod: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentMethod) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
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

export const COMPLETE_CHECKOUT = gql`
  mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        number
        status
        total {
          gross {
            amount
            currency
          }
        }
      }
      confirmationNeeded
      confirmationData
      errors {
        field
        message
      }
    }
  }
`;
