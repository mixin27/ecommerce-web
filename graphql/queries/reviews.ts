import { gql } from '@apollo/client';

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
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
      product {
        id
        name
        averageRating
        reviewCount
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    product(id: $productId) {
      id
      reviews {
        id
        rating
        title
        comment
        isVerified
        createdAt
        updatedAt
        user {
          id
          name
        }
      }
      averageRating
      reviewCount
    }
  }
`;
