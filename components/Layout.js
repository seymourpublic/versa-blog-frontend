// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>VersaBlog</div>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/men" style={styles.navLink}>Men</Link>
          <Link href="/youth" style={styles.navLink}>Youth</Link>
          <Link href="/prayer" style={styles.navLink}>Prayer Points</Link>
          <Link href="/about" style={styles.navLink}>About</Link>
          <Link href="/contact" style={styles.navLink}>Contact</Link>
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} VersaBlog. All rights reserved.
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: 'rgb(0, 0, 0)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#ff5400',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    flexWrap: 'wrap', // Allows wrapping for smaller screens
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap', // Wraps navigation links on smaller screens
    justifyContent: 'center', // Centers links on smaller screens
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    backgroundColor: 'rgb(0, 0, 0)',
  },
  footer: {
    background: '#ff5400',
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
  },
  '@media (max-width: 768px)': { // Media query for devices with width <= 768px
    header: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    nav: {
      flexDirection: 'column',
      gap: '1rem',
    },
    logo: {
      fontSize: '1.5rem',
    },
  },
};
