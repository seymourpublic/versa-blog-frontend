// pages/posts/[id].js
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      publishedAt
      updatedAt
      categories {
        id
        name
      }
      status
     
    }
  }
`;

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error loading post. Please try again later.</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </Layout>
  );

  const { post } = data;
  
  // Format dates
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;
  
  const formattedPublishDate = publishDate ? 
    publishDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;
    
  const formattedUpdateDate = updatedDate ? 
    updatedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;

  // Extract first paragraph for meta description
  const getDescription = (content) => {
    const firstParagraph = content.match(/<p>(.*?)<\/p>/);
    if (firstParagraph && firstParagraph[1]) {
      return firstParagraph[1].replace(/<[^>]*>?/gm, '').substring(0, 160);
    }
    return content.replace(/<[^>]*>?/gm, '').substring(0, 160);
  };
  
  const description = getDescription(post.content);
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Process headings in content
  function addIdsToHeadings(content) {
    return content.replace(/<h([2-6])>(.*?)<\/h\1>/g, (match, level, text) => {
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  }
  
  const contentWithIds = addIdsToHeadings(post.content);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const text = content.replace(/<[^>]*>?/gm, '');
    const wpm = 225; // average words per minute
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  };
  
  const readingTime = calculateReadingTime(post.content);

  return (
    <Layout>
      <Head>
        <title>{post.title} | Your Blog</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
            <span className="mr-4 mb-2">
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {readingTime} min read
            </span>
            
            {formattedPublishDate && (
              <time dateTime={post.publishedAt} className="mr-4 mb-2">
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {formattedPublishDate}
              </time>
            )}
            
            {formattedUpdateDate && formattedUpdateDate !== formattedPublishDate && (
              <span className="mb-2">
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Updated: {formattedUpdateDate}
              </span>
            )}
          </div>
          
          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span 
                  key={category.id}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
        
        {/* Post Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {post.categories?.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Categories:</span>{' '}
                  {post.categories.map((cat, index) => (
                    <span key={cat.id}>
                      {cat.name}{index < post.categories.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-800"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </article>

      <style jsx global>{`
        .post-content {
          color: #374151;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        .post-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          scroll-margin-top: 80px;
        }
        
        .post-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          scroll-margin-top: 80px;
        }
        
        .post-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        
        .post-content p {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
        }
        
        .post-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .post-content a:hover {
          text-decoration: none;
        }
        
        .post-content ul, .post-content ol {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
          padding-left: 1.625rem;
        }
        
        .post-content ul {
          list-style-type: disc;
        }
        
        .post-content ol {
          list-style-type: decimal;
        }
        
        .post-content li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .post-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
          margin: 1.5rem 0;
        }
        
        .post-content pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .post-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875em;
        }
        
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1.5rem 0;
        }
        
        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .post-content th, .post-content td {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
        }
        
        .post-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        @media (max-width: 640px) {
          .post-content {
            font-size: 1rem;
          }
          
          .post-content h2 {
            font-size: 1.5rem;
          }
          
          .post-content h3 {
            font-size: 1.25rem;
          }
          
          .post-content h4 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </Layout>
  );
}