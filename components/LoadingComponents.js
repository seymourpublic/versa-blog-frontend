// components/LoadingComponents.js
import React from 'react';
import styles from '../styles/CategoryPage.module.css';

// Generic loading spinner
export function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const spinnerSize = {
    small: '20px',
    medium: '40px',
    large: '60px'
  }[size];

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div 
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #f3f3f3',
          borderTop: '3px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }}
      />
      <p>{message}</p>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

// Skeleton for post cards
export function PostCardSkeleton() {
  return (
    <div className={`${styles.skeletonCard} animate-pulse`}>
      {/* Image skeleton */}
      <div 
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: 'var(--color-bg-section)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--spacing-md)'
        }}
      />
      
      {/* Title skeleton */}
      <div className={styles.skeletonTitle} />
      
      {/* Content skeleton */}
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} style={{ width: '60%' }} />
      
      {/* Date skeleton */}
      <div 
        style={{
          height: '14px',
          backgroundColor: 'var(--color-bg-section)',
          borderRadius: 'var(--radius-sm)',
          width: '40%',
          marginTop: 'var(--spacing-md)'
        }}
      />
    </div>
  );
}

// Skeleton for featured post
export function FeaturedPostSkeleton() {
  return (
    <div className={`${styles.featuredPostSection} animate-pulse`}>
      <div className={styles.featuredPostText}>
        {/* Category label skeleton */}
        <div 
          style={{
            height: '14px',
            backgroundColor: 'var(--color-bg-section)',
            borderRadius: 'var(--radius-sm)',
            width: '30%',
            marginBottom: 'var(--spacing-sm)'
          }}
        />
        
        {/* Title skeleton */}
        <div 
          style={{
            height: '48px',
            backgroundColor: 'var(--color-bg-section)',
            borderRadius: 'var(--radius-sm)',
            width: '90%',
            marginBottom: 'var(--spacing-md)'
          }}
        />
        
        {/* Date skeleton */}
        <div 
          style={{
            height: '14px',
            backgroundColor: 'var(--color-bg-section)',
            borderRadius: 'var(--radius-sm)',
            width: '25%',
            marginBottom: 'var(--spacing-lg)'
          }}
        />
        
        {/* Button skeleton */}
        <div 
          style={{
            height: '44px',
            backgroundColor: 'var(--color-bg-section)',
            borderRadius: 'var(--radius-md)',
            width: '120px'
          }}
        />
      </div>
      
      <div className={styles.featuredPostImage}>
        <div 
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: 'var(--color-bg-section)',
            borderRadius: 'var(--radius-lg)'
          }}
        />
      </div>
    </div>
  );
}

// Skeleton for posts grid
export function PostsGridSkeleton({ count = 4 }) {
  return (
    <div className={styles.postsContainer}>
      <div className={styles.postsGrid}>
        {Array.from({ length: count }, (_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Complete page loading skeleton
export function CategoryPageSkeleton() {
  return (
    <div className={styles.loadingSkeleton}>
      <FeaturedPostSkeleton />
      
      {/* Latest stories section skeleton */}
      <div className={styles.latestStoriesSection}>
        <div className={styles.latestStoriesHeadingContainer}>
          <div 
            style={{
              height: '32px',
              backgroundColor: 'var(--color-bg-section)',
              borderRadius: 'var(--radius-sm)',
              width: '200px'
            }}
          />
        </div>
        
        <div className={styles.searchForm}>
          <div 
            style={{
              height: '44px',
              backgroundColor: 'var(--color-bg-section)',
              borderRadius: 'var(--radius-md)',
              width: '220px'
            }}
          />
          <div 
            style={{
              height: '44px',
              backgroundColor: 'var(--color-bg-section)',
              borderRadius: 'var(--radius-md)',
              width: '180px'
            }}
          />
        </div>
      </div>
      
      <PostsGridSkeleton />
    </div>
  );
}

// Error retry component
export function ErrorRetry({ onRetry, message, title }) {
  return (
    <div className={styles.error}>
      <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
        {title || 'Failed to load content'}
      </h3>
      <p style={{ marginBottom: 'var(--spacing-lg)' }}>
        {message || 'Something went wrong while loading the content. Please try again.'}
      </p>
      <button 
        onClick={onRetry}
        className={styles.retryButton}
        aria-label="Retry loading content"
      >
        Try Again
      </button>
    </div>
  );
}

// Add CSS for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}