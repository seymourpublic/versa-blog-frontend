// hooks/useInfiniteScroll.js - Intersection Observer for infinite loading
import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = ({
  loading = false,
  hasMore = true,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '200px'
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef();

  // Intersection Observer callback
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading && !isFetching) {
      setIsFetching(true);
    }
  }, [hasMore, loading, isFetching]);

  // Setup Intersection Observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin,
      threshold
    };

    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver, rootMargin, threshold]);

  // Handle load more when isFetching changes
  useEffect(() => {
    if (isFetching && onLoadMore) {
      onLoadMore().finally(() => {
        setIsFetching(false);
      });
    }
  }, [isFetching, onLoadMore]);

  return { loadMoreRef, isFetching };
};