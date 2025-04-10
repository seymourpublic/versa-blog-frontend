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

// A simple HeroSection component for the home page.
function HeroSection() {
  return (
    <div style={heroStyles.container}>
      <div style={heroStyles.overlay}></div>
      <div style={heroStyles.content}>
        <h1 style={heroStyles.title}>Discover Inspiring Stories</h1>
        <p style={heroStyles.subtitle}>
          Explore faith, hope, and life-changing insights for a better tomorrow.
        </p>
        <button style={heroStyles.button}>Explore Now</button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState({});

  // Query posts (using empty filter initially)
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter },
  });
  
  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  // Basic in-memory filtering by search text (optional)
  let filteredPosts = data?.filteredPosts || [];
  if (searchText) {
    filteredPosts = filteredPosts.filter(
      post =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Pagination example (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Layout><p style={styles.message}>Loading posts...</p></Layout>;
  if (error) return <Layout><p style={{...styles.message, color:'red'}}>Error loading posts.</p></Layout>;

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      <div style={styles.pageContainer}>
        {/* Side Navigation */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarHeading}>Categories</h3>
          <a style={styles.sidebarLink}>Men</a>
          <a style={styles.sidebarLink}>Youth</a>
          <a style={styles.sidebarLink}>Prayer Points</a>
        </aside>
        
        {/* Main Content */}
        <div style={styles.main}>
          {/* Search Bar */}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          {/* Post Cards Grid */}
          <div style={styles.cardsGrid}>
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

const heroStyles = {
  container: {
    position: 'relative',
    height: '450px',
    backgroundImage: "url('/hero.jpg')", // Change to your hero image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '2rem',
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)', // Trick to break out of the parent container
    position: 'relative',
    height: '450px',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'relative',
    color: '#fff',
    textAlign: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '0 1rem',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.2rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const styles = {
  message: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
  },
  pageContainer: {
    display: "flex",
    gap: "2rem",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "fit-content",
  },
  sidebarHeading: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    color: "#0070f3",
    fontWeight: "600",
  },
  sidebarLink: {
    display: "block",
    marginBottom: "0.75rem",
    color: "#333",
    textDecoration: "none",
    cursor: "pointer",
  },
  main: {
    flex: 1,
  },
  searchBar: {
    textAlign: "right",
    marginBottom: "1.5rem",
  },
  searchInput: {
    padding: "0.6rem",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  pagination: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
  },
  pageButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  activePageButton: {
    background: "#0070f3",
    color: "#fff",
    borderColor: "#0070f3",
  },
};
