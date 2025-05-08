import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
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
      categories { id name }
      status
    }
  }
`;

const client = createApolloClient();

export async function getStaticPaths() {
  const { data } = await client.query({ query: gql`{ posts { id } }` });
  return {
    paths: data.posts.map(({ id }) => ({ params: { id: String(id) } })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    const { data } = await client.query({ query: GET_POST_BY_ID, variables: { id: params.id } });
    if (!data.post) return { notFound: true };
    return { props: { post: data.post }, revalidate: 10 };
  } catch {
    return { notFound: true };
  }
}

function useTableOfContents(html) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const temp = [];
    const regex = /<h([23])>(.*?)<\/h\1>/g;
    let m;
    while ((m = regex.exec(html))) {
      const level = Number(m[1]);
      const text = m[2].replace(/<[^>]+>/g, '');
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      temp.push({ id, text, level });
    }
    setHeadings(temp);
  }, [html]);

  useEffect(() => {
    const elems = document.querySelectorAll('.post-content h2, .post-content h3');
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActiveId(entry.target.id)),
      { rootMargin: '-70% 0px -20% 0px' }
    );
    elems.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return { headings, activeId };
}

function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <nav className="sticky top-24 p-4 bg-opacity-20 bg-white border border-white rounded-lg shadow-sm hidden lg:block text-white">
      <h2 className="font-semibold mb-2">Contents</h2>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} className={h.level === 3 ? 'pl-4 text-sm' : ''}>
            <a
              href={`#${h.id}`}
              className={`hover:text-blue-300 ${activeId === h.id ? 'text-blue-300 font-medium' : 'text-white'}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const share = useCallback(platform => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(title);
    const endpoints = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } else {
      window.open(endpoints[platform], '_blank');
    }
  }, [url, title]);

  return (
    <div className="flex items-center space-x-2 text-white">
      <button onClick={() => share('twitter')} aria-label="Twitter" className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
        <Twitter className="w-5 h-5" />
      </button>
      <button onClick={() => share('facebook')} aria-label="Facebook" className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
        <Facebook className="w-5 h-5" />
      </button>
      <button onClick={() => share('linkedin')} aria-label="LinkedIn" className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
        <Linkedin className="w-5 h-5" />
      </button>
      <button onClick={() => share('copy')} aria-label="Copy link" className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
        <Copy className="w-5 h-5" />
      </button>
      {copied && <span className="text-green-300 text-sm ml-2">Copied!</span>}
    </div>
  );
}

export default function PostDetail({ post }) {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_POST_BY_ID, { variables: { id: router.query.id }, skip: !router.query.id });
  const postData = data?.post || post;
  const html = postData.content;
  const { headings, activeId } = useTableOfContents(html);

  const published = new Date(postData.publishedAt);
  const updated = new Date(postData.updatedAt);
  const readingTime = Math.ceil(html.replace(/<[^>]+>/g, '').split(/\s+/).length / 200);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) return (
    <Layout>
      <div className="animate-pulse p-8">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    </Layout>
  );
  if (error) return (
    <Layout>
      <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>Error loading post.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go home</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.content.slice(0, 150)} />
      </Head>

      <header className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {postData.title}
          </motion.h1>
          <div className="flex justify-center space-x-4 text-sm text-white opacity-75">
            <time dateTime={postData.publishedAt}>{published.toLocaleDateString()}</time>
            <span>· {readingTime} min read</span>
            {updated > published && <span>· Updated {updated.toLocaleDateString()}</span>}
          </div>
          <div className="mt-4">
            <ShareButtons url={url} title={postData.title} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-12 text-white">
        <TableOfContents headings={headings} activeId={activeId} />
        <article className="prose prose-lg prose-invert max-w-none post-content">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>

      <footer className="border-t py-8 px-4 text-center text-white">
        <Link href="/blog" className="hover:underline">← Back to Blog</Link>
      </footer>
    </Layout>
  );
}
