import { gql } from '@apollo/client';

export const GET_USER_ADDRESSES = gql`
  query GetUserAddresses {
    userAddresses {
      id
      fullName
      phone
      addressLine1
      addressLine2
      city
      state
      country
      postalCode
      isDefault
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($userId: ID!, $input: CreateAddressInput!) {
    createAddress(userId: $userId, input: $input) {
      id
      fullName
      addressLine1
      city
      state
      country
      postalCode
    }
  }
`;
