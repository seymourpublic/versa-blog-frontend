// components/PostCard.js - Updated with optimized images and CSS modules
import Link from 'next/link';
import { PostCardImage } from './OptimizedImage';
import styles from '../styles/PostCard.module.css';

const PostCard = ({ post }) => {
  // Extract excerpt from content if not provided
  const excerpt = post.excerpt || 
    (post.content.length > 120 ? 
      post.content.substring(0, 120) + '...' : 
      post.content
    );

  // Format date
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

  const displayDate = post.updatedAt ? 
    formatDate(post.updatedAt) : 
    (post.publishedAt ? formatDate(post.publishedAt) : '');

  // Generate reading time estimate
  const estimateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const readingTime = estimateReadingTime(post.content);

  return (
    <article className={styles.card}>
      {/* Post Image */}
      <div className={styles.imageContainer}>
        <PostCardImage
          src={post.imageUrl || '/placeholder.jpg'}
          alt={post.title}
          className={styles.image}
        />
        
        {/* Reading time overlay */}
        <div className={styles.readingTime}>
          {readingTime} min read
        </div>
      </div>

      {/* Post Content */}
      <div className={styles.cardBody}>
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className={styles.categories}>
            {post.categories.slice(0, 2).map((category) => (
              <span key={category.id} className={styles.categoryTag}>
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={styles.title}>
          <Link 
            href={`/posts/${post.slug || post.id}`} 
            className={styles.titleLink}
            aria-label={`Read article: ${post.title}`}
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className={styles.excerpt}>
          {excerpt}
        </p>

        {/* Meta information */}
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

        {/* Read more link */}
        <Link 
          href={`/posts/${post.slug || post.id}`} 
          className={styles.readMore}
          aria-label={`Continue reading ${post.title}`}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;