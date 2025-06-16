// pages/_app.js - Updated with Error Boundary and better error handling
import '../styles/globals.css';
import { ApolloWrapper } from '../lib/apollo-client';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default behavior (logging to console)
      event.preventDefault();
      
      // You can send this to your error tracking service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `Unhandled Promise Rejection: ${event.reason}`,
          fatal: false
        });
      }
    };

    const handleError = (event) => {
      console.error('Global error:', event.error);
      
      // You can send this to your error tracking service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `Global Error: ${event.error}`,
          fatal: false
        });
      }
    };

    // Add global error handlers
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary 
      title="Application Error"
      message="Something went wrong with the application. Please refresh the page to try again."
    >
      <ApolloWrapper>
        <ErrorBoundary
          title="Page Error"
          message="There was an error loading this page. Please try refreshing or navigating to a different page."
        >
          <Component {...pageProps} />
        </ErrorBoundary>
      </ApolloWrapper>
    </ErrorBoundary>
  );
}

export default MyApp;