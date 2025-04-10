// components/PostCard.js
import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div style={styles.card}>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} style={styles.image} />
      )}
      <div style={styles.content}>
        <h2 style={styles.title}>
          <Link href={`/posts/${post.id}`} style={styles.link}>
            {post.title}
          </Link>
        </h2>
        <p style={styles.date}>
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>
        <p style={styles.excerpt}>
          {post.content.substring(0, 150)}...
        </p>
        <Link href={`/posts/${post.id}`} style={styles.readMore}>
          Read more →
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    fontSize: '1.8rem',
    margin: '0 0 0.5rem 0',
  },
  date: {
    fontSize: '0.9rem',
    color: '#777',
    marginBottom: '0.75rem',
  },
  excerpt: {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
  },
  readMore: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#0070f3',
  },
};
