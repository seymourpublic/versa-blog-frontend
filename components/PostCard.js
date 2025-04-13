// components/PostCard.js
import Link from 'next/link';

export default function PostCard({ post }) {
  // Use a placeholder if there’s no image
  const imageUrl = post.imageUrl || '/placeholder.jpg';
  
  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={post.title} style={styles.image} />
      <div style={styles.cardBody}>
        <h2 style={styles.title}>
          <Link href={`/posts/${post.id}`} style={styles.link}>
            {post.title}
          </Link>
        </h2>
        <p style={styles.date}>
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>
        <p style={styles.excerpt}>
          {post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}
        </p>
        <Link href={`/posts/${post.id}`} style={styles.readMore}>
          Read More →
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    margin: '0 0 0.5rem',
    color: '#333',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
  },
  date: {
    fontSize: '0.9rem',
    color: '#777',
    marginBottom: '0.5rem',
  },
  excerpt: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#555',
    marginBottom: '1rem',
  },
  readMore: {
    color: '#0070f3',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '1rem',
  },
};
