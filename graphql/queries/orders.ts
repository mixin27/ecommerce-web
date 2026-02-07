import { gql } from "@apollo/client";

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      orderNumber
      subtotal
      tax
      shippingCost
      discount
      total
      status
      paymentStatus
      paymentMethod
      trackingNumber
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          images
        }
      }
      shippingAddress {
        id
        fullName
        addressLine1
        addressLine2
        city
        state
        country
        postalCode
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      subtotal
      tax
      shippingCost
      discount
      total
      status
      paymentStatus
      paymentMethod
      trackingNumber
      customerNotes
      adminNotes
      createdAt
      updatedAt
      items {
        id
        quantity
        price
        product {
          id
          name
          slug
          images
          price
        }
      }
      shippingAddress {
        id
        fullName
        phone
        addressLine1
        addressLine2
        city
        state
        country
        postalCode
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($input: OrdersInput!) {
    orders(input: $input) {
      id
      orderNumber
      subtotal
      tax
      shippingCost
      discount
      total
      status
      paymentStatus
      paymentMethod
      trackingNumber
      createdAt
      user {
        id
        name
        email
      }
      items {
        id
        quantity
        price
        product {
          id
          name
          images
        }
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      total
      status
      paymentStatus
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {
    updateOrderStatus(id: $id, input: $input) {
      id
      orderNumber
      status
      updatedAt
    }
  }
`;
