// components/OptimizedImage.js
import React, { useState } from 'react';
import Image from 'next/image';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  placeholder = 'blur',
  quality = 80,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.jpg',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder
  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+zb/i6Y4HYs3tpf5Uxjre3lIWt3ZLcOVdlO7xtPIKElf0qntm5jRcG8R0B+txqK99g==";

  const handleLoad = (event) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback image if current src is not already the fallback
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    }
    
    if (onError) onError(event);
  };

  // Loading skeleton styles
  const skeletonStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite',
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 z-10"
          style={{
            ...skeletonStyle,
            borderRadius: 'inherit',
          }}
          aria-label="Loading image..."
        />
      )}

      {/* Error state */}
      {hasError && imgSrc === fallbackSrc && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm"
          style={{ borderRadius: 'inherit' }}
        >
          <div className="text-center">
            <svg 
              className="w-8 h-8 mx-auto mb-2 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Image unavailable</span>
          </div>
        </div>
      )}

      {/* Next.js optimized image */}
      <Image
        src={imgSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        sizes={sizes || (fill ? '100vw' : undefined)}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          objectFit: 'cover',
          borderRadius: 'inherit',
        }}
        {...props}
      />

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

// Predefined image variants for common use cases
export const HeroImage = (props) => (
  <OptimizedImage
    {...props}
    fill
    priority
    sizes="100vw"
    quality={90}
    className={`object-cover ${props.className || ''}`}
  />
);

export const PostCardImage = (props) => (
  <OptimizedImage
    {...props}
    width={props.width || 400}
    height={props.height || 250}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className={`object-cover ${props.className || ''}`}
  />
);

export const FeaturedPostImage = (props) => (
  <OptimizedImage
    {...props}
    width={props.width || 600}
    height={props.height || 400}
    priority
    sizes="(max-width: 768px) 100vw, 50vw"
    quality={85}
    className={`object-cover ${props.className || ''}`}
  />
);

export const AvatarImage = (props) => (
  <OptimizedImage
    {...props}
    width={props.width || 64}
    height={props.height || 64}
    className={`rounded-full object-cover ${props.className || ''}`}
  />
);

export default OptimizedImage;