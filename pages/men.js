// pages/posts.js
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

// Query to fetch categories for the dropdown
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

export default function MenPage() {
  // All hooks are now declared at the top
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter },
  });

  const { loading: loadingCats, error: errorCats, data: dataCats } = useQuery(GET_CATEGORIES);

  // Update filter object when search text or selected category changes
  useEffect(() => {
    const newFilter = { searchText };
    if (selectedCategory) {
      newFilter.category = selectedCategory;
    }
    setFilter(newFilter);
  }, [searchText, selectedCategory]);

  // Re-run the posts query whenever filter changes
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
        <p style={{ ...styles.message, color: 'red' }}>Error loading posts.</p>
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
        <p style={{ ...styles.message, color: 'red' }}>Error loading categories.</p>
      </Layout>
    );
  }

  const posts = data?.filteredPosts || [];
  const categories = dataCats?.categories || [];

  // Pagination (client-side)
  const postsPerPage = 4;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
           
          <div style={styles.pageContainer}>
            {/* Optional side navigation */}
            <aside style={styles.sidebar}>
              <h3 style={styles.sidebarHeading}>Static Categories</h3>
              <a style={styles.sidebarLink}>Men</a>
              <a style={styles.sidebarLink}>Youth</a>
              <a style={styles.sidebarLink}>Prayer Points</a>
            </aside>
    
            {/* Main Content */}
            <div style={styles.main}>
              {/* Filters (Search & Category) */}
              <div style={styles.filterBar}>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on filter change
                  }}
                  style={styles.searchInput}
                />
    
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on filter change
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
      },
      pageContainer: {
        display: 'flex',
        gap: '2rem',
      },
      sidebar: {
        width: '200px',
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 'fit-content',
      },
      sidebarHeading: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
        color: '#0070f3',
        fontWeight: '600',
      },
      sidebarLink: {
        display: 'block',
        marginBottom: '0.75rem',
        color: '#333',
        textDecoration: 'none',
        cursor: 'pointer',
      },
      main: {
        flex: 1,
      },
      filterBar: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: '1.5rem',
      },
      searchInput: {
        padding: '0.6rem',
        width: '250px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
      },
      select: {
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        backgroundColor: '#fff',
        width: '180px',
      },
      cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      },
      pagination: {
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
      },
      pageButton: {
        padding: '0.5rem 1rem',
        border: '1px solid #ccc',
        background: '#fff',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '0.9rem',
      },
      activePageButton: {
        background: '#0070f3',
        color: '#fff',
        borderColor: '#0070f3',
      },
    };
    