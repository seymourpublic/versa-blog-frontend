// pages/youth.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import Link from 'next/link';
import PostCard from '../components/PostCard';
import HeroSection from '../components/HeroSection';

/** ------------
 *  GraphQL Queries
 *--------------*/
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

/** ------------
 *  Main Component
 *--------------*/
export default function YouthPage() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filter, setFilter] = useState({categoryId: "67fd4677caf2905cfc1b925a"});
    const [currentPage, setCurrentPage] = useState(1);
  
    const { loading, error, data, refetch } = useQuery(GET_POSTS, {
      variables: { filter },
    });
  
    const { loading: loadingCats, error: errorCats, data: dataCats } =
      useQuery(GET_CATEGORIES);
  
    /* Handle Filters */
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        const newFilter = {categoryId: "67fd4677caf2905cfc1b925a"};
        if (searchText) newFilter.searchText = searchText;
        if (selectedCategory) newFilter.categoryId = selectedCategory;
        setFilter(newFilter);
        setCurrentPage(1);
      }, 300); // Debounce to avoid rapid requests
  
      return () => clearTimeout(timeoutId);
    }, [searchText, selectedCategory]);
  
    useEffect(() => {
      refetch({ filter });
    }, [filter, refetch]);
  
    if (loading || loadingCats)
      return (
        <Layout>
          <p style={styles.loading}>Loading...</p>
        </Layout>
      );
  
    if (error || errorCats)
      return (
        <Layout>
          <p style={styles.error}>Error loading data.</p>
        </Layout>
      );
  
    const posts = data?.filteredPosts || [];
    const categories = dataCats?.categories || [];
  
    const postsPerPage = 4;
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const currentPosts = posts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    );
  
    const handlePageChange = (page) => setCurrentPage(page);
  
    const [featuredPost, ...otherPosts] = posts;
  
    const handleSearchChange = (e) => setSearchText(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const youthCategory = dataCats?.categories.find(cat => cat.name === "Youth");
  
    return (
      <Layout>
        <HeroSection title="Discover Posts on the Issues that the Youth Face" subtitle="Engaging content just for you" />
        {featuredPost && (
          <section style={styles.heroSection}>
            <div style={styles.heroTextContainer}>
              <p style={styles.heroCategoryLabel}>Discover Posts on the Issues that the Youth Face</p>
              <h1 style={styles.heroTitle}>{featuredPost.title}</h1>
              <p style={styles.heroDate}>
                {new Date(featuredPost.updatedAt).toDateString()}
              </p>
              <Link href={`/posts/${featuredPost.id}`}>
                <button style={styles.readArticleButton}>Read article</button>
              </Link>
            </div>
            <div style={styles.heroImageContainer}>
              <img src="/placeholder.jpg" alt="Hero Post" style={styles.heroImage} />
            </div>
          </section>
        )}
  
        {/* Latest Stories + Search Row */}
<section style={styles.latestStoriesSection}>
  <div style={styles.latestStoriesHeadingContainer}>
    <h2 style={styles.latestStoriesHeading}>Latest stories</h2>
  </div>
  <form 
    style={styles.searchBarContainer}
    onSubmit={(e) => e.preventDefault()} // This prevents form submission
  >
    <input
      type="text"
      placeholder="What are you looking for?"
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
      <option value={youthCategory?.id || ""}>All Categories</option>
      {youthCategory?.subcategories?.map((subcat) => (
        <option key={subcat.id} value={subcat.id}>
          {subcat.name}
        </option>
      ))}
    </select>
  </form>
</section>
  
        <section style={styles.postsContainer}>
          {otherPosts.length === 0 ? (
            <p style={styles.noPosts}>No posts found.</p>
          ) : (
            <div style={styles.postsGrid}>
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
  
        {otherPosts.length > 0 && (
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
        )}
      </Layout>
    );
  }

/** ------------
 *  Styles
 *--------------*/
const styles = {
  /* General */
  loading: {
    textAlign: 'center',
    margin: '2rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    margin: '2rem',
    fontSize: '1.2rem',
    color: 'red',
  },
  noPosts: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    marginTop: '2rem',
  },

  /* Hero Section */
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  heroTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  heroCategoryLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0',
    lineHeight: '1.2',
  },
  heroDate: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
  },
  readArticleButton: {
    alignSelf: 'start',
    backgroundColor: '#ff5400',
    color: '#fff',
    padding: '0.8rem 1.4rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },

  /* Latest Stories & Search */
  latestStoriesSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  latestStoriesHeadingContainer: {
    flex: '0 0 auto',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '1rem',
  },
  latestStoriesHeading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: 0,
    textAlign: 'center',
  },
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  searchInput: {
    padding: '0.8rem 1rem',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    padding: '0.8rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#fff',
    width: '100%',
    outline: 'none',
    color: 'rgba(1, 1, 1, 0.8)',
  },

  /* Posts Grid */
  postsContainer: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    padding: '0 2rem',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },

  /* Pagination */
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  pageButton: {
    padding: '0.7rem 1.2rem',
    background: '#fff',
    border: '1px solid #ccc',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  activePageButton: {
    backgroundColor: '#0A615F',
    color: '#fff',
    border: '1px solid #0A615F',
  },

  /* Media Queries */
  '@media (max-width: 768px)': {
    heroSection: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
    },
    heroTextContainer: {
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: '2rem',
    },
    latestStoriesSection: {
      alignItems: 'center',
    },
    postsGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};
