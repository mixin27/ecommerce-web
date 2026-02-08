import { gql } from '@apollo/client';

export const GET_MY_WISHLIST = gql`
  query GetMyWishlist {
    myWishlist {
      id
      items {
        id
        addedAt
        product {
          id
          name
          slug
          description
          price
          comparePrice
          images
          stock
          isActive
          isFeatured
          averageRating
          reviewCount
          category {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      id
      items {
        id
        product {
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      id
      items {
        id
      }
    }
  }
`;
