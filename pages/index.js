// pages/index.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';

// Example GraphQL query to fetch your posts
// Adjust this query to match your actual backend schema
const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
    }
  }
`;

export default function HomePage() {
  // Optionally, store or handle search/filter states here
  const [searchText, setSearchText] = useState('');
  
  // Query posts (replace this with your actual approach for filtering, pagination, etc.)
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  // Perform client-side filtering or refetch if your API supports search
  // For now, we'll just filter in memory (not ideal for large datasets)
  let filteredPosts = data?.posts || [];
  if (searchText) {
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Example: Pagination mock
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  if (loading) return <Layout><p style={{ textAlign: 'center' }}>Loading posts...</p></Layout>;
  if (error) return <Layout><p style={{ textAlign: 'center', color: 'red' }}>Error loading posts.</p></Layout>;

  return (
    <Layout>
      <div style={styles.pageContainer}>
        {/* Side Navigation */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            <h3 style={styles.sideHeader}>Categories</h3>
            <a style={styles.sideLink}>Men</a>
            <a style={styles.sideLink}>Youth</a>
            <a style={styles.sideLink}>Prayer Points</a>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div style={styles.main}>
          {/* Search Bar */}
          <div style={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Hinted search text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Post Cards */}
          <div style={styles.cardsContainer}>
            {currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {/* Show some page numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                style={{
                  ...styles.pageButton,
                  ...(page === currentPage ? styles.activePageButton : {}),
                }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              style={styles.pageButton}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    gap: '2rem',
  },
  sidebar: {
    width: '200px',
    backgroundColor: '#f3f3f3',
    padding: '1rem',
    borderRadius: '6px',
    height: 'fit-content',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sideHeader: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  sideLink: {
    display: 'block',
    color: '#333',
    textDecoration: 'none',
    padding: '0.3rem 0',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  main: {
    flex: 1,
  },
  searchBarContainer: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchInput: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    width: '250px',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Show 2 columns
    gap: '1.5rem',
  },
  pagination: {
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  pageButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  activePageButton: {
    background: '#0070f3',
    color: '#fff',
    border: 'none',
  },
};

