// pages/index.js
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import styles from '../styles/HomePage.module.css';

// Fetch only the data we need
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
  const { loading, error, data } = useQuery(GET_POSTS);
  const posts = data?.posts || [];

  return (
    <Layout>
      {/* HERO SECTION */}
      <HeroSection 
        title="Discover Posts on the Issues that the Youth Face" 
        subtitle="Engaging content just for you" 
      />

      {/* MISSION SECTION */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Our mission is to empower boys and men with faith-based guidance on personal growth, relationships, and more.
          </h2>
        </div>
      </section>

      {/* SHOWCASE / IMAGE SECTION */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseImageContainer}>
              <Image
                src="/placeholder.jpg"
                alt="Young men participating in a faith-based mentoring session"
                width={600}
                height={400}
                className={styles.showcaseImage}
                priority
              />
            </div>
            <div className={styles.showcaseContent}>
              <h2>Coming Next</h2>
              <p>
                A sneak peek into our upcoming posts and topics we have in store for you.
                Stay tuned for more insights and stories that will inspire and motivate you.
              </p>
              <Link href="/upcoming" passHref>
                <button 
                  className={styles.ctaButton}
                  onClick={() => console.log('Learn more clicked')}
                  aria-label="Learn more about upcoming content"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST POSTS SECTION */}
      <section className={styles.postsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Latest Posts</h2>
          
          {loading && <div className={styles.loadingIndicator}>Loading posts...</div>}
          
          {error && (
            <div className={styles.errorMessage}>
              Error loading posts. Please try again later.
            </div>
          )}
          
          {!loading && !error && posts.length === 0 && (
            <p className={styles.noPosts}>No posts available yet. Check back soon!</p>
          )}
          
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <h3 className={styles.postTitle}>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className={styles.postExcerpt}>
                  {post.excerpt || (post.content && post.content.substring(0, 100) + '...')}
                </p>
                <p className={styles.postDate}>
                  {post.updatedAt
                    ? `Updated: ${new Date(post.updatedAt).toLocaleDateString()}`
                    : `Published: ${new Date(post.publishedAt).toLocaleDateString()}`}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}