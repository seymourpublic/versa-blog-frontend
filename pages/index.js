// pages/index.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';

// Example: optionally fetch some posts or data if desired
const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      publishedAt
      updatedAt
    }
  }
`;

export default function HomePage() {
  // If you want to display some posts
  const { loading, error, data } = useQuery(GET_POSTS);

  // Example posts from your backend
  const posts = data?.posts || [];

  return (
    <Layout>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Stories That Speak To You</h1>
          <p style={styles.heroSubtitle}>
          Discover inspiring blog posts, practical advice, and timeless wisdom to overcome life's challenges.
          </p>
        </div>
      </section>

      {/* PRODUCTIVITY FEATURES SECTION */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}> Our mission is to empower boys and men with faith-based guidance on personal growth, relationships, and more.</h2>
        
      </section>

      {/* SHOWCASE / IMAGE SECTION */}
      <section style={styles.showcaseSection}>
        <div style={styles.showcaseImageContainer}>
        <img
          src="/placeholder.jpg"
          alt="Pomodoro Timer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        </div>
        <div style={styles.showcaseContent}>
          <h2>Coming Next</h2>
          <p>
            Let your workspace automatically adjust availability and do‑not‑disturb settings. 
            It’s always up‑to‑date, so you don’t have to manually toggle statuses.
          </p>
          <button style={styles.ctaButton}>Learn More</button>
        </div>
      </section>

      {/* LATEST POSTS SECTION (Optional) */}
      <section style={styles.postsSection}>
        <h2 style={styles.sectionTitle}>Latest Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p style={{ color: 'red' }}>Error loading posts.</p>}
        <div style={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postExcerpt}>
                {post.content.length > 100
                  ? post.content.substring(0, 100) + '...'
                  : post.content}
              </p>
              <p style={styles.postDate}>
                {post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString()
                  : 'published'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

const styles = {
  hero: {
    position: 'relative',
    backgroundImage: "url('/placeholder2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '80vh',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '4rem'
  },
  heroContent: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #ff5400',
    maxWidth: '600px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem'
  },
  heroButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ff5400',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  featuresSection: {
    marginBottom: '4rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid #ff5400',
  },
  featureImage: {
    width: '80px',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  featureText: {
    fontSize: '1rem',
    color: '#444'
  },
  showcaseSection: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '4rem',
    maxWidth: '1200px',
    margin: '0 auto',
    
    color: 'rgba(255, 255, 255, 0.8)',
  },
  showcaseImageContainer: {
    flex: 1,
    textAlign: 'center',    
  },
  showcaseImage: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.15)'
  },
  showcaseContent: {
    flex: 1,
    padding: '1rem'
  },
  ctaButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ff5400',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  postsSection: {
    marginBottom: '4rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
   
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    border: '1px solid #ff5400',
  },
  postTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  postExcerpt: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '0.5rem'
  },
  postDate: {
    fontSize: '0.85rem',
    color: '#999'
  }
};
