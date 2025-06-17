// components/CategoryPageTemplate.js
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from './Layout';
import PostCard from './PostCard';
import HeroSection from './HeroSection';
import ErrorBoundary, { useErrorHandler } from './ErrorBoundary';
import { 
  LoadingSpinner, 
  CategoryPageSkeleton, 
  ErrorRetry 
} from './LoadingComponents';
import { FeaturedPostImage } from './OptimizedImage';
import { GET_POSTS, GET_CATEGORIES } from '../graphql/queries';
import styles from '../styles/CategoryPage.module.css';

const CategoryPageTemplate = ({ 
  categoryId, 
  categoryName, 
  heroTitle, 
  heroSubtitle,
  featuredPostLabel 
}) => {
  // State management
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState({ categoryId });
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  
  const { captureError } = useErrorHandler();

  // GraphQL queries with error handling
  const { 
    loading, 
    error, 
    data, 
    refetch,
    networkStatus 
  } = useQuery(GET_POSTS, {
    variables: { filter },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('Posts query error:', error);
      captureError(error);
    }
  });

  const { 
    loading: loadingCats, 
    error: errorCats, 
    data: dataCats,
    refetch: refetchCategories 
  } = useQuery(GET_CATEGORIES, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Categories query error:', error);
      captureError(error);
    }
  });

  // Retry mechanism - moved before early returns
  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    try {
      await Promise.all([
        refetch?.({ filter }),
        refetchCategories?.()
      ]);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [refetch, refetchCategories, filter]);

  // Event handlers - moved before early returns
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Smooth scroll to top of posts section
    document.querySelector(`.${styles.latestStoriesSection}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  // Debounced filter updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilter = { categoryId };
      if (searchText.trim()) newFilter.searchText = searchText.trim();
      if (selectedCategory) newFilter.categoryId = selectedCategory;
      
      setFilter(newFilter);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, selectedCategory, categoryId]);

  // Refetch data when filter changes
  useEffect(() => {
    if (refetch) {
      refetch({ filter }).catch(error => {
        console.error('Refetch error:', error);
      });
    }
  }, [filter, refetch]);

  // Early loading state
  if (loading && !data && retryCount === 0) {
    return (
      <Layout>
        <CategoryPageSkeleton />
      </Layout>
    );
  }

  // Error state with retry
  if ((error || errorCats) && !data && !dataCats) {
    return (
      <Layout>
        <ErrorRetry 
          onRetry={handleRetry}
          title="Failed to load page content"
          message="We're having trouble loading the content. Please check your connection and try again."
        />
      </Layout>
    );
  }

  // Data processing
  const posts = data?.filteredPosts || [];
  const categories = dataCats?.categories || [];
  const mainCategory = categories.find(cat => cat.name === categoryName);

  // Pagination logic
  const postsPerPage = 4;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const [featuredPost, ...otherPosts] = posts;

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          className={`${styles.paginationButton} ${page === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      );
    }

    return buttons;
  };

  return (
    <Layout>
      <HeroSection 
        title={heroTitle} 
        subtitle={heroSubtitle} 
      />
      
      {/* Featured Post Section */}
      {featuredPost && (
        <section className={styles.featuredPostSection}>
          <div className={styles.featuredPostText}>
            <p className={styles.categoryLabel}>
              {featuredPostLabel || `Discover Posts on the Issues that ${categoryName} Face`}
            </p>
            <h1 className={styles.featuredTitle}>{featuredPost.title}</h1>
            <p className={styles.postDate}>
              {new Date(featuredPost.updatedAt || featuredPost.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <Link 
              href={`/posts/${featuredPost.id}`}
              className={styles.readArticleButton}
              aria-label={`Read article: ${featuredPost.title}`}
            >
              Read article
            </Link>
          </div>
          <div className={styles.featuredPostImage}>
            <FeaturedPostImage
              src="/placeholder.jpg"
              alt={featuredPost.title}
              className={styles.heroImage}
            />
          </div>
        </section>
      )}

      {/* Latest Stories & Search Section */}
      <section className={styles.latestStoriesSection}>
        <div className={styles.latestStoriesHeadingContainer}>
          <h2 className={styles.latestStoriesHeading}>Latest stories</h2>
        </div>
        
        <form 
          className={styles.searchForm}
          onSubmit={(e) => e.preventDefault()}
          role="search"
          aria-label="Search and filter posts"
        >
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchText}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search posts"
            autoComplete="off"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.categorySelect}
            aria-label="Filter by category"
          >
            <option value={mainCategory?.id || ""}>All Categories</option>
            {mainCategory?.subcategories?.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>
        </form>
      </section>

      {/* Loading state for refetch */}
      {loading && data && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
          <LoadingSpinner size="small" message="Updating results..." />
        </div>
      )}

      {/* Posts Grid */}
      <section className={styles.postsContainer}>
        {otherPosts.length === 0 && !loading ? (
          <div className={styles.noPosts}>
            {searchText || selectedCategory !== mainCategory?.id ? 
              'No posts found matching your criteria. Try adjusting your search or filters.' :
              'No posts found in this category yet. Check back soon!'
            }
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {currentPosts.map((post) => (
              <ErrorBoundary key={post.id} title="Failed to load post">
                <PostCard post={post} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {otherPosts.length > 0 && totalPages > 1 && (
        <nav 
          className={styles.pagination}
          aria-label="Posts pagination"
        >
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
          
          {renderPaginationButtons()}
          
          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </Layout>
  );
};

export default CategoryPageTemplate;