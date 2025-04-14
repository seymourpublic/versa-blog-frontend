// pages/men
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import Link from 'next/link';
import PostCard from '../components/PostCard';
import HeroSection from '../components/HeroSection';

const GET_POSTS = gql`
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
      tags {
        id
        name
      }
    }
  }
`;

const GET_CATEGORIES = gql`
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

export default function YouthPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter },
  });

  const { loading: loadingCats, error: errorCats, data: dataCats } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    const newFilter = { searchText };
    if (selectedCategory) newFilter.category = selectedCategory;
    setFilter(newFilter);
  }, [searchText, selectedCategory]);

  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  if (loading) {
    return (
      <Layout>
        <p style={styles.message}>Loading posts...</p>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <p style={{ ...styles.message, color: '#ff4d4f' }}>Error loading posts.</p>
      </Layout>
    );
  }
  if (loadingCats) {
    return (
      <Layout>
        <p style={styles.message}>Loading categories...</p>
      </Layout>
    );
  }
  if (errorCats) {
    return (
      <Layout>
        <p style={{ ...styles.message, color: '#ff4d4f' }}>Error loading categories.</p>
      </Layout>
    );
  }

  const posts = data?.filteredPosts || [];
  const categories = dataCats?.categories || [];

  // Pagination (client-side)
  const postsPerPage = 4;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      {/* Hero Section gives a welcoming banner */}
      <HeroSection title="Discover Posts on the Issues that the Youth Face" subtitle="Engaging content just for you" />

      <div style={styles.pageContainer}>
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarHeading}>Browse</h3>
          <Link href="/men" style={styles.navLink}>Men</Link>
          <Link href="/youth" style={styles.navLink}>Youth</Link>
          <Link href="/prayer" style={styles.navLink}>Prayer Points</Link>
          <Link href="/about" style={styles.navLink}>About</Link>
          <Link href="/contact" style={styles.navLink}>Contact</Link>
        </aside>

        {/* Main Content */}
        <div style={styles.main}>
          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Posts Grid */}
          <div style={styles.cardsGrid}>
            {currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
  message: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    padding: '2rem 0',
    border: '1px solid #ff5400'
  },
  pageContainer: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    alignSelf: 'flex-start',
    border: '1px solid #ff5400',
  },
  sidebarHeading: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#333',
    fontWeight: '700',
  },
  sidebarLink: {
    display: 'block',
    marginBottom: '0.75rem',
    color: '#0070f3',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'color 0.2s ease-in-out',
  },
  main: {
    flex: 1,
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginBottom: '2rem',
  },
  searchInput: {
    padding: '0.8rem 1rem',
    width: '260px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    border: '1px solid #ff5400'
  },
  select: {
    padding: '0.8rem 1rem',
    border: '1px solid #ff5400',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#fff',
    width: '200px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
   color: 'rgba(1, 1, 1, 0.8)',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
  },
  pagination: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  pageButton: {
    padding: '0.7rem 1.2rem',
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    border: '1px solid #ff5400'
  },
  activePageButton: {
    background: '#0070f3',
    color: '#fff',
    borderColor: '#0070f3',
    backgroundColor: '#ff5400',
  },
};
