import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginAuthInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
        isActive
        emailVerified
      }
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterAuthInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        role
        isActive
        emailVerified
      }
      accessToken
      refreshToken
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
      isActive
      emailVerified
      createdAt
      updatedAt
    }
  }
`;
