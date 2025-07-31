import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetFilteredProducts(
    $channel: String!
    $attributes: [AttributeInput!]
    $search: String
    $after: String
  ) {
    products(
      first: 12
      channel: $channel
      filter: { attributes: $attributes, search: $search }
      after: $after
    ) {
      edges {
        node {
          id
          name
          slug
          media {
            id
            url
            alt
            type
          }
          variants {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID, $slug: String, $channel: String) {
    product(id: $id, slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      seoTitle
      seoDescription
      defaultVariant {
        id
        name
        sku
        pricing {
          priceUndiscounted {
            gross {
              amount
              currency
            }
          }
          price {
            gross {
              amount
              currency
            }
          }
        }
      }
      variants {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            id
            name
          }
          values {
            id
            name
          }
        }
      }
      media {
        id
        url
        alt
        type
      }
      attributes {
        attribute {
          id
          name
        }
        values {
          id
          name
        }
      }
      category {
        id
        name
        slug
      }
      productType {
        id
        name
      }
      isAvailableForPurchase
      availableForPurchase
    }
  }
`;
