// components/CategoryPage.js
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Layout from './Layout';
import Link from 'next/link';
import PostCard from './PostCard';
import HeroSection from './HeroSection';
import { GET_POSTS, GET_CATEGORIES } from '../graphql/queries';

export default function CategoryPage({ categoryId, categoryName }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState({ categoryId });
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { filter },
  });

  const { loading: loadingCats, error: errorCats, data: dataCats } =
    useQuery(GET_CATEGORIES);

  /* Handle Filters */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilter = { categoryId };
      if (searchText) newFilter.searchText = searchText;
      if (selectedCategory) newFilter.categoryId = selectedCategory;
      setFilter(newFilter);
      setCurrentPage(1);
    }, 300); // Debounce to avoid rapid requests

    return () => clearTimeout(timeoutId);
  }, [searchText, selectedCategory, categoryId]);

  useEffect(() => {
    refetch({ filter });
  }, [filter, refetch]);

  if (loading || loadingCats)
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );

  if (error || errorCats)
    return (
      <Layout>
        <div className="error">Error loading data.</div>
      </Layout>
    );

  const posts = data?.filteredPosts || [];
  const mainCategory = dataCats?.categories.find(cat => cat.name === categoryName);

  const postsPerPage = 4;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const [featuredPost, ...otherPosts] = posts;

  return (
    <Layout>
      <HeroSection 
        title={`Discover Posts on the Issues that ${categoryName} Face`} 
        subtitle="Engaging content just for you" 
      />
      
      {featuredPost && (
        <section className="featured-post-section">
          <div className="featured-post-text">
            <p className="category-label">Discover Posts on the Issues that {categoryName} Face</p>
            <h1 className="featured-title">{featuredPost.title}</h1>
            <p className="post-date">
              {new Date(featuredPost.updatedAt).toDateString()}
            </p>
            <Link href={`/posts/${featuredPost.slug || featuredPost.id}`}>
              <button className="read-article-button">Read article</button>
            </Link>
          </div>
          <div className="featured-post-image">
            {/* Use next/image in production for better optimization */}
            <img src="/placeholder.jpg" alt="Featured Post" className="hero-image" />
          </div>
        </section>
      )}

      {/* Latest Stories + Search Row */}
      <section className="latest-stories-section">
        <div className="latest-stories-heading-container">
          <h2 className="latest-stories-heading">Latest stories</h2>
        </div>
        <form 
          className="search-form"
          onSubmit={(e) => e.preventDefault()} 
        >
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
            aria-label="Search posts"
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="category-select"
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

      <section className="posts-container">
        {otherPosts.length === 0 ? (
          <p className="no-posts">No posts found.</p>
        ) : (
          <div className="posts-grid">
            {currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {otherPosts.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </Layout>
  );
}
