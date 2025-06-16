// utils/dynamicImports.js - Dynamic imports for code splitting
import dynamic from 'next/dynamic';

// Heavy components that should be code-split
export const DynamicPostEditor = dynamic(
  () => import('../components/PostEditor'),
  { 
    loading: () => <div>Loading editor...</div>,
    ssr: false // Don't render on server for heavy components
  }
);

export const DynamicChart = dynamic(
  () => import('../components/Chart'),
  { 
    loading: () => <div>Loading chart...</div>,
    ssr: false
  }
);

export const DynamicCommentSection = dynamic(
  () => import('../components/CommentSection'),
  { 
    loading: () => <div>Loading comments...</div>
  }
);