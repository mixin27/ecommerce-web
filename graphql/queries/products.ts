import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($input: GetProductsInput!) {
    products(input: $input) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String, $slug: String) {
    product(id: $id, slug: $slug) {
      id
      name
      slug
      description
      price
      comparePrice
      costPrice
      images
      sku
      barcode
      stock
      lowStockThreshold
      metaTitle
      metaDescription
      isActive
      isFeatured
      category {
        id
        name
        slug
      }
      variants {
        id
        name
        sku
        price
        stock
        attributes
      }
      reviews {
        id
        rating
        title
        comment
        isVerified
        createdAt
        user {
          id
          name
        }
      }
      averageRating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      description
      price
      stock
      images
      isActive
      isFeatured
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      slug
      description
      price
      stock
      images
      isActive
      isFeatured
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
