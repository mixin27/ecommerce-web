import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      image
      parent {
        id
        name
        slug
      }
      children {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID, $slug: String) {
    category(id: $id, slug: $slug) {
      id
      name
      slug
      description
      image
      parent {
        id
        name
        slug
      }
      children {
        id
        name
        slug
        description
        image
      }
      products {
        id
        name
        slug
        price
        images
        stock
        isActive
        isFeatured
        averageRating
        reviewCount
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
      image
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
      image
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;
