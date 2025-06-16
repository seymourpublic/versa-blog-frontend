// components/OptimizedCategoryPage.js - Full optimization implementation
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useQuery } from '@apollo/client';
import Layout from './Layout';
import HeroSection from './HeroSection';
import VirtualizedPostsList from './VirtualizedPostsList';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { GET_POSTS, GET_CATEGORIES } from '../graphql/queries';
import styles from '../styles/CategoryPage.module.css';
import OptimizedImage from './OptimizedImage';
import Link from 'next/link';

const POSTS_PER_PAGE = 12;

// Memoized search form component
const SearchForm = memo(({ 
  searchText, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  categories 
}) => {
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleCategoryChange = useCallback((e) => {
    onCategoryChange(e.target.value);
  }, [onCategoryChange]);

  return (
    <div className={styles.searchForm}>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchText}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />
      <select 
        value={selectedCategory} 
        onChange={handleCategoryChange}
        className={styles.categorySelect}
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
});

SearchForm.displayName = 'SearchForm';

// Memoized featured post component
const FeaturedPost = memo(({ post }) => {
  if (!post) return null;

  return (
    <section className={styles.featuredPostSection}>
      <div className={styles.featuredPostText}>
        <span className={styles.featuredLabel}>Featured Post</span>
        <h2 className={styles.featuredTitle}>{post.title}</h2>
        <p className={styles.featuredDate}>
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        <Link href={`/posts/${post.slug || post.id}`} className={styles.featuredButton}>
          Read Now
        </Link>
      </div>
      <div className={styles.featuredPostImage}>
        <OptimizedImage
          src={post.imageUrl || '/placeholder.jpg'}
          alt={post.title}
          width={600}
          height={400}
          priority
          className={styles.featuredImage}
        />
      </div>
    </section>
  );
});

FeaturedPost.displayName = 'FeaturedPost';

const OptimizedCategoryPage = memo(({ 
  categoryId, 
  categoryName, 
  heroTitle, 
  heroSubtitle 
}) => {
  // State management
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);

  // Memoized filter object
  const filter = useMemo(() => {
    const baseFilter = { categoryId };
    if (searchText) baseFilter.searchText = searchText;
    if (selectedCategory) baseFilter.categoryId = selectedCategory;
    return baseFilter;
  }, [categoryId, searchText, selectedCategory]);

  // GraphQL queries
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: { 
      filter,
      limit: POSTS_PER_PAGE,
      offset: 0
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Update posts when data changes
  useEffect(() => {
    if (data?.filteredPosts) {
      if (currentPage === 1) {
        setAllPosts(data.filteredPosts);
      } else {
        setAllPosts(prev => [...prev, ...data.filteredPosts]);
      }
    }
  }, [data, currentPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setAllPosts([]);
  }, [filter]);

  // Memoized callbacks
  const handleSearchChange = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!loading && data?.filteredPosts?.length === POSTS_PER_PAGE) {
      const nextPage = currentPage + 1;
      await fetchMore({
        variables: {
          filter,
          limit: POSTS_PER_PAGE,
          offset: (nextPage - 1) * POSTS_PER_PAGE
        }
      });
      setCurrentPage(nextPage);
    }
  }, [loading, data, currentPage, fetchMore, filter]);

  const handlePostReadMore = useCallback((postId, event) => {
    // Track analytics or perform other actions
    console.log('Post read more clicked:', postId);
  }, []);

  // Infinite scroll setup
  const hasMore = useMemo(() => {
    return data?.filteredPosts?.length === POSTS_PER_PAGE;
  }, [data]);

  const { loadMoreRef, isFetching } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: handleLoadMore
  });

  // Memoized data
  const categories = useMemo(() => categoriesData?.categories || [], [categoriesData]);
  const [featuredPost, ...otherPosts] = useMemo(() => allPosts, [allPosts]);

  if (error) {
    return (
      <Layout>
        <div className={styles.error}>
          Error loading posts. Please try again.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />
      
      <FeaturedPost post={featuredPost} />
      
      <section className={styles.latestStoriesSection}>
        <div className={styles.latestStoriesHeadingContainer}>
          <h2>Latest Stories</h2>
        </div>
        
        <SearchForm
          searchText={searchText}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      </section>

      <VirtualizedPostsList
        posts={otherPosts}
        loading={loading && currentPage === 1}
        onReadMore={handlePostReadMore}
      />

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className={styles.loadMore}>
          {isFetching && <div className={styles.loadingSpinner}>Loading more...</div>}
        </div>
      )}
    </Layout>
  );
});

OptimizedCategoryPage.displayName = 'OptimizedCategoryPage';

export default OptimizedCategoryPage;