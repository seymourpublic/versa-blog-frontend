// components/Layout.js - Updated with CSS modules and accessibility
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(`.${styles.nav}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return router.pathname === path;
  };

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/men', label: 'Men' },
    { href: '/youth', label: 'Youth' },
    { href: '/prayer', label: 'Prayer Points' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header} role="banner">
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="VersaBlog - Home">
            <span>VersaBlog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} role="navigation" aria-label="Main navigation">
            <ul className={styles.navList}>
              {navigationItems.map((item) => (
                <li key={item.href} className={styles.navItem}>
                  <Link 
                    href={item.href} 
                    className={`${styles.navLink} ${isActiveRoute(item.href) ? styles.navLinkActive : ''}`}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav 
          id="mobile-menu"
          className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}
          role="navigation" 
          aria-label="Mobile navigation"
        >
          <ul className={styles.mobileNavList}>
            {navigationItems.map((item) => (
              <li key={item.href} className={styles.mobileNavItem}>
                <Link 
                  href={item.href} 
                  className={`${styles.mobileNavLink} ${isActiveRoute(item.href) ? styles.mobileNavLinkActive : ''}`}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <main 
        id="main-content"
        className={styles.main} 
        role="main"
        tabIndex="-1"
      >
        {children}
      </main>

      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} VersaBlog. All rights reserved.</p>
          
          {/* Additional footer links */}
          <nav aria-label="Footer navigation">
            <ul className={styles.footerNav}>
              <li>
                <Link href="/privacy" className={styles.footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}