import { gql } from "@apollo/client";

export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      subtotal
      itemCount
      items {
        id
        quantity
        product {
          id
          name
          slug
          price
          images
          stock
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      subtotal
      itemCount
      items {
        id
        quantity
        product {
          id
          name
          price
          images
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
      subtotal
      itemCount
      items {
        id
        quantity
        product {
          id
          name
          price
          images
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      id
      subtotal
      itemCount
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;
