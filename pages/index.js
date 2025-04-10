// pages/index.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';

const GET_POSTS = gql`
  query GetPosts($filter: PostFilter) {
    filteredPosts(filter: $filter) {
      id
      title
      content
      slug
      publishedAt
      imageUrl
      categories {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export default function Home() {
  const [filter, setFilter] = useState({});
  
  // Query posts with an empty filter initially
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter },
  });
  
  // Optionally, you could add a search bar here and update filter state.
  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  if (loading) return <Layout><p>Loading posts...</p></Layout>;
  if (error) return <Layout><p>Error loading posts.</p></Layout>;

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Latest Posts</h1>
      <div style={styles.postsGrid}>
        {data.filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    margin: "2rem 0",
    color: "#333",
  },
  postsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
  },
};
