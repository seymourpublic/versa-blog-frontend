import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { createApolloClient } from '../../lib/apollo-client';
import { motion } from 'framer-motion';

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
  const [tableOfContents, setTableOfContents] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!data?.post) return;
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      const headings = document.querySelectorAll('.post-content h2, .post-content h3');
      let currentId = '';
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = heading.id;
        }
      });
      setCurrentHeading(currentId);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  useEffect(() => {
    if (!data?.post) return;
    const extractHeadings = (content) => {
      const headingRegex = /<h([2-3])>(.*?)<\/h\1>/g;
      const headings = [];
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text, level });
      }
      return headings;
    };
    setTableOfContents(extractHeadings(data.post.content));
  }, [data]);

  const sharePost = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = data?.post?.title || '';
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
        break;
      default:
        break;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-8">
          {/* loading skeleton */}
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">Error loading post. Please try again later.</p>
          </div>
          <p className="mt-2 text-red-600 text-sm">{error.message}</p>
        </div>
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </Layout>
  );

  const { post } = data;
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;
  const formattedPublishDate = publishDate ? publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const formattedUpdateDate = updatedDate ? updatedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const getDescription = (content) => {
    const firstParagraph = content.match(/<p>(.*?)<\/p>/);
    if (firstParagraph && firstParagraph[1]) {
      return firstParagraph[1].replace(/<[^>]*>?/gm, '').substring(0, 160);
    }
    return content.replace(/<[^>]*>?/gm, '').substring(0, 160);
  };
  const description = getDescription(post.content);
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';
  const addIdsToHeadings = (content) => content.replace(/<h([2-6])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    return `<h${level} id="${id}" class="group flex items-center">${text}<a href="#${id}" aria-label="Link to this heading" class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-5 h-5 text-gray-400 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></a></h${level}>`;
  });
  const contentWithIds = addIdsToHeadings(post.content);
  const calculateReadingTime = (content) => {
    const text = content.replace(/<[^>]*>?/gm, '');
    const wpm = 225;
    return Math.ceil(text.trim().split(/\s+/).length / wpm);
  };
  const readingTime = calculateReadingTime(post.content);
  const enhanceCodeBlocks = (content) => content.replace(/<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
    const langClass = language ? `language-${language}` : '';
    const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return `<div class="code-block-wrapper relative"><div class="code-block-header bg-gray-800 text-gray-200 text-sm px-4 py-2 rounded-t-lg flex justify-between items-center">${language ? `<span class="font-mono">${language}</span>` : '<span>Code</span>'}<button class="copy-code-btn text-gray-400 hover:text-white transition-colors" data-code="${encodeURIComponent(decoded)}" title="Copy code"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button></div><pre class="m-0 rounded-t-none"><code class="${langClass}">${code}</code></pre></div>`;
  });
  const contentWithEnhancedCodeBlocks = enhanceCodeBlocks(contentWithIds);

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              'headline': post.title,
              'datePublished': post.publishedAt,
              'dateModified': post.updatedAt,
              'description': description,
              'mainEntityOfPage': { '@type': 'WebPage', '@id': postUrl }
            })
          }}
        />
      </Head>

      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm font-medium">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors"> Home </Link>
              <span className="mx-2 text-white">/</span>
              <Link href="/blog" className="text-white hover:text-gray-200 transition-colors"> Blog </Link>
              <span className="mx-2 text-white">/</span>
              <span className="text-white truncate">{post.title}</span>
            </nav>
            {/* Post Header */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{post.title}</h1>
            <div className="flex flex-wrap items-center text-base text-white mb-6">
              <span className="inline-flex items-center mr-4 mb-2">
              <svg width="16" height="16" class="mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                {readingTime} min read 
              </span>
              {formattedPublishDate && (
                <time dateTime={post.publishedAt} className="inline-flex items-center mr-4 mb-2 ">
                  <svg width="16" height="16" class="mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                  {formattedPublishDate}
                </time>
              )}
              {formattedUpdateDate && formattedUpdateDate !== formattedPublishDate && (
                <span className="inline-flex items-center mr-4 mb-2">
                  
                   Updated: {formattedUpdateDate}
                </span>
              )}
            </div>
            {/* Categories */}
            {post.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link key={category.id} href={`/categories/${category.id}`} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full transition-colors">
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {tableOfContents.length > 0 && (
            <aside className="hidden md:block w-64 flex-shrink-0">
              {tableOfContents.length > 0 && (
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
                <nav className="toc space-y-2">
                  {tableOfContents.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block ${
                        heading.level === 3 ? 'pl-4 text-sm' : 'font-medium'
                      } ${
                        currentHeading === heading.id
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      } transition-colors`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>

                {/* Social Share - Desktop */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Share this article</h3>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => sharePost('twitter')}
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => sharePost('facebook')}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => sharePost('linkedin')}
                      className="text-gray-500 hover:text-blue-700 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => sharePost('copy')}
                      className="text-gray-500 hover:text-gray-800 transition-colors"
                      aria-label="Copy link"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                      </svg>
                    </button>
                  </div>
                  {isCopied && (
                    <span className="mt-2 text-sm text-green-600 block">Link copied!</span>
                  )}
                </div>
              </div>
            </aside>
          )}
            </aside>
          )}
          <div className="flex-1">
            {/* Mobile ToC dropdown */}
            {tableOfContents.length > 0 && (
              <div className="md:hidden mb-8">
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="font-medium text-lg cursor-pointer">
                    Table of Contents
                  </summary>
                  <nav className="mt-4 space-y-2 pl-2">
                    {tableOfContents.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block ${
                          heading.level === 3 ? 'pl-4 text-sm' : 'font-medium'
                        } text-gray-600 hover:text-blue-600 transition-colors py-1`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </details>
              </div>
            )}
            
            {/* Post Content */}
            <motion.div 
              className="post-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: contentWithEnhancedCodeBlocks }}
            />
            
            {/* Mobile Share Buttons */}
            <div className="mt-12 md:hidden">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Share this article</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => sharePost('twitter')}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => sharePost('facebook')}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => sharePost('linkedin')}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => sharePost('copy')}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 transition-colors"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                </button>
              </div>
              {isCopied && (
                <span className="mt-2 text-sm text-green-600 block">Link copied!</span>
              )}
            </div>
            
            {/* Post Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  {post.categories?.length > 0 && (
                    <div className="text-base text-gray-600">
                      <span className="font-medium">Categories:</span>{' '}
                      {post.categories.map((cat, index) => (
                        <Link 
                          key={cat.id}
                          href={`/categories/${cat.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {cat.name}{index < post.categories.length - 1 ? ', ' : ''}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </footer>
            
            
            
            
          </div>
        </div>
      </article>

      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" aria-label="Back to top">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* … remaining global styles unchanged … */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const copyButtons = document.querySelectorAll('.copy-code-btn');
            
            copyButtons.forEach(button => {
              button.addEventListener('click', () => {
                const code = decodeURIComponent(button.getAttribute('data-code'));
                navigator.clipboard.writeText(code).then(() => {
                  const originalHTML = button.innerHTML;
                  button.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                  button.classList.add('text-green-500');
                  
                  setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.classList.remove('text-green-500');
                  }, 2000);
                });
              });
            });
            
            // Add Intersection Observer for headings
            const headings = document.querySelectorAll('.post-content h2, .post-content h3');
            
            if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const tocLinks = document.querySelectorAll('.toc a');
                    
                    tocLinks.forEach(link => {
                      if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('text-blue-600');
                      } else {
                        link.classList.remove('text-blue-600');
                      }
                    });
                  }
                });
              }, { rootMargin: '-100px 0px -80% 0px' });
              
              headings.forEach(heading => {
                observer.observe(heading);
              });
            }
          });
          `
        }}
      />

      <style jsx global>{`
        .post-content {
          color: #374151;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        .post-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          scroll-margin-top: 80px;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .post-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          scroll-margin-top: 80px;
        }
        
        .post-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
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
          text-underline-offset: 2px;
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
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          color: #4b5563;
          font-style: italic;
          margin: 2rem 0;
          background-color: #eff6ff;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .post-content code:not(pre code) {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875em;
        }
        
        .post-content .code-block-wrapper {
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .post-content pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1.5rem;
          overflow-x: auto;
          border-radius: 0 0 0.5rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        
        .post-content pre code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          padding: 0;
          background: transparent;
          color: inherit;
        }
        
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.9em;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .post-content th, .post-content td {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
        }
        
        .post-content th {
          background-color: #f9fafb;
          font-weight: 600;
          text-align: left;
        }
        
        .post-content tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .post-content tr:hover {
          background-color: #f3f4f6;
        }
        
        .post-content hr {
          margin: 3rem 0;
          border: 0;
          height: 1px;
          background-color: #e5e7eb;
        }
        
        .post-content .task-list-item {
          list-style-type: none;
          margin-left: -1.5rem;
        }
        
        .post-content .task-list-item input {
          margin-right: 0.5rem;
        }
        
        .aspect-w-16 {
          position: relative;
          padding-bottom: 56.25%;
        }
        
        .aspect-w-16 > div {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
