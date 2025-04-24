// graphql/queries.js
import { gql } from '@apollo/client';

// Keeping the original queries as requested
export const GET_POSTS = gql`
  query GetPosts($filter: PostFilter) {
    filteredPosts(filter: $filter) {
      id
      title
      content
      slug
      publishedAt
      updatedAt
      status
      categories {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      parent {
        id
        name
      }
      subcategories {
        id
        name
      }
    }
  }
`;

// For homepage
export const GET_HOMEPAGE_POSTS = gql`
  query {
    posts {
      id
      title
      content
      publishedAt
      updatedAt
      slug
      excerpt
    }
  }
`;