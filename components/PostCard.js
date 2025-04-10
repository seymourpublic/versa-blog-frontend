// components/PostCard.js
import Link from 'next/link';

export default function PostCard({ post }) {
  // fallback if there's no image
  const imageUrl = post.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image';
  
  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={post.title} style={styles.image} />
      <div style={styles.body}>
        <h2 style={styles.title}>{post.title}</h2>
        <p style={styles.text}>
          {post.content && post.content.length > 120
            ? post.content.substring(0, 120) + '...'
            : post.content}
        </p>
        <Link href={`/posts/${post.id}`}>
          <button style={styles.readMore}>Read More</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  body: {
    padding: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    margin: '0 0 0.5rem',
    color: '#333',
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#444',
    margin: '0 0 1rem',
  },
  readMore: {
    backgroundColor: '#f6f6f6',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
