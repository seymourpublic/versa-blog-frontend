// pages/posts/[id].js
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { createApolloClient } from '../../lib/apollo-client';

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

const client = createApolloClient();

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        posts {
          id
        }
      }
    `
  });

  const paths = data.posts.map((post) => ({
    params: { id: post.id.toString() }
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const { data } = await client.query({
      query: GET_POST_BY_ID,
      variables: { id: params.id },
    });

    if (!data?.post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: data.post,
      },
      revalidate: 10,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-72 bg-gray-200 rounded mb-6"></div>
          <div className="h-5 bg-gray-200 rounded mb-3"></div>
          <div className="h-5 bg-gray-200 rounded mb-3"></div>
          <div className="h-5 bg-gray-200 rounded mb-3"></div>
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-base text-gray-600 mb-6">
          <span className="mr-4 mb-2">
            <svg
              width="1em" height="1em"
              className="inline mr-1 align-middle"
              fill="none" stroke="color: #f3f4f6;"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min read
          </span>
            
            {formattedPublishDate && (
              <time dateTime={post.publishedAt}
              className="inline-flex items-center mr-4 mb-2 text-sm">
              {/* switch to w-4/h-4 (16px) if your text is around 16px, or w-3/h-3 for smaller text */}
              <svg className="w-4 h-4 mr-1 flex-shrink-0"
               fill="none" stroke="color: #f3f4f6;"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0
                     002-2V7a2 2 0 00-2-2H5a2 2 0 00-2
                     2v12a2 2 0 002 2z" />
               </svg>
              {formattedPublishDate}
              </time>
            )}
            
            {formattedUpdateDate && formattedUpdateDate !== formattedPublishDate && (
              <span className="inline-flex items-center mr-4 mb-2 text-sm">
            
              <svg className="w-4 h-4 mr-1 flex-shrink-0"
                   fill="none" stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 
                         004.582 9m0 0H9m11 11v-5h-.581m0 
                         0a8.003 8.003 0 01-15.357-2m15.357 
                         2H15" />
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
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              {post.categories?.length > 0 && (
                <div className="text-base text-gray-600">
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
              {/* Social sharing buttons could go here */}
            </div>
          </div>
        </footer>
      </article>

      <style jsx global>{`
        .post-content {
          color: #f3f4f6;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        .post-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #f3f4f6;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          scroll-margin-top: 80px;
        }
        
        .post-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f3f4f6;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          scroll-margin-top: 80px;
        }
        
        .post-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f3f4f6;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        
        .post-content p {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .post-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .post-content a:hover {
          text-decoration: none;
        }
        
        .post-content ul, .post-content ol {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .post-content ul {
          list-style-type: disc;
        }
        
        .post-content ol {
          list-style-type: decimal;
        }
        
        .post-content li {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .post-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1.5rem;
          color: #f3f4f6;
          font-style: italic;
          margin: 2rem 0;
        }
        
        .post-content pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .post-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
        }
        
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        
        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .post-content th, .post-content td {
          padding: 1rem;
          border: 1px solid #e5e7eb;
        }
        
        .post-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        @media (max-width: 640px) {
          .post-content {
            font-size: 1.0625rem;
          }
          
          .post-content h2 {
            font-size: 1.75rem;
          }
          
          .post-content h3 {
            font-size: 1.375rem;
          }
          
          .post-content h4 {
            font-size: 1.125rem;
          }
          
          .post-content pre {
            padding: 1.25rem;
          }
          
          .post-content th, .post-content td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </Layout>
  );
}