// hooks/usePerformanceMonitor.js - Monitor component performance
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef();
  const renderCount = useRef(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return { renderCount: renderCount.current };
};