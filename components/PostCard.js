import React, { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PostCardImage } from './OptimizedImage';
import styles from '../styles/PostCard.module.css';

const PostCard = memo(({ post, priority = false, onReadMore }) => {
  // Memoize expensive calculations
  const excerpt = useMemo(() => {
    return post.excerpt || 
      (post.content.length > 120 ? 
        post.content.substring(0, 120) + '...' : 
        post.content
      );
  }, [post.excerpt, post.content]);

  const displayDate = useMemo(() => {
    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return 'Date unavailable';
      }
    };

    return post.updatedAt ? 
      formatDate(post.updatedAt) : 
      (post.publishedAt ? formatDate(post.publishedAt) : '');
  }, [post.updatedAt, post.publishedAt]);

  const readingTime = useMemo(() => {
    const wordsPerMinute = 200;
    const wordCount = post.content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [post.content]);

  const limitedCategories = useMemo(() => {
    return post.categories?.slice(0, 2) || [];
  }, [post.categories]);

  // Memoized click handler
  const handleReadMore = useCallback((event) => {
    if (onReadMore) {
      onReadMore(post.id, event);
    }
  }, [onReadMore, post.id]);

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <PostCardImage
          src={post.imageUrl || '/placeholder.jpg'}
          alt={post.title}
          className={styles.image}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
        
        <div className={styles.readingTime}>
          {readingTime} min read
        </div>
      </div>

      <div className={styles.cardBody}>
        {limitedCategories.length > 0 && (
          <div className={styles.categories}>
            {limitedCategories.map((category) => (
              <span key={category.id} className={styles.categoryTag}>
                {category.name}
              </span>
            ))}
          </div>
        )}

        <h3 className={styles.title}>
          <Link 
            href={`/posts/${post.id}`} 
            className={styles.titleLink}
            aria-label={`Read article: ${post.title}`}
          >
            {post.title}
          </Link>
        </h3>

        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.meta}>
          <time 
            dateTime={post.updatedAt || post.publishedAt}
            className={styles.date}
          >
            {displayDate}
          </time>
          
          {post.status && post.status !== 'published' && (
            <span className={`${styles.status} ${styles[post.status]}`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          )}
        </div>

        <Link 
          href={`/posts/${post.id}`} 
          className={styles.readMore}
          aria-label={`Continue reading ${post.title}`}
          onClick={handleReadMore}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
