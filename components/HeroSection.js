// components/HeroSection.js
export default function HeroSection() {
    return (
      <div style={styles.container}>
        <div style={styles.overlay} />
        <div style={styles.content}>
          <h1 style={styles.title}>Discover Inspiring Stories</h1>
          <p style={styles.subtitle}>
            Explore faith, hope, and transformative insights through our blog.
          </p>
          <button style={styles.button}>Get Started</button>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      position: 'relative',
      width: '100vw', // Full viewport width
      height: '450px',
      backgroundImage: "url('/placeholder2.jpg')", // Ensure hero.jpg is in the public folder
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginBottom: '2rem',
      // To make it span the entire viewport even if it's rendered inside a constrained container:
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for contrast
    },
    content: {
      position: 'relative',
      zIndex: 1, // Ensure content is above the overlay
      height: '100%',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 1rem',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    subtitle: {
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.2rem',
      backgroundColor: '#0070f3',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: '#ff5400',
    },
  };
  