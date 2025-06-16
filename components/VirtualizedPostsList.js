// components/VirtualizedPostsList.js - Virtual scrolling for performance
import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import PostCard from './PostCard';
import styles from '../styles/PostsList.module.css';

const ITEM_HEIGHT = 400; // Approximate height of each post card
const CONTAINER_HEIGHT = 800; // Visible area height

const PostItem = memo(({ index, style, data }) => {
  const { posts, onReadMore } = data;
  const post = posts[index];
  
  if (!post) return null;

  return (
    <div style={style}>
      <div className={styles.postItemWrapper}>
        <PostCard 
          post={post} 
          priority={index < 4} // Prioritize first 4 items
          onReadMore={onReadMore}
        />
      </div>
    </div>
  );
});

PostItem.displayName = 'PostItem';

const VirtualizedPostsList = memo(({ 
  posts, 
  loading = false, 
  onReadMore,
  containerHeight = CONTAINER_HEIGHT 
}) => {
  const [containerRef, setContainerRef] = useState(null);

  // Memoize list data to prevent unnecessary re-renders
  const listData = useMemo(() => ({
    posts,
    onReadMore
  }), [posts, onReadMore]);

  // Callback for setting container ref
  const setRef = useCallback((node) => {
    if (node) {
      setContainerRef(node);
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={styles.emptyState}>
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div ref={setRef} className={styles.virtualizedContainer}>
      <List
        height={containerHeight}
        itemCount={posts.length}
        itemSize={ITEM_HEIGHT}
        itemData={listData}
        overscanCount={2} // Render 2 extra items outside visible area
      >
        {PostItem}
      </List>
    </div>
  );
});

VirtualizedPostsList.displayName = 'VirtualizedPostsList';

export default VirtualizedPostsList;