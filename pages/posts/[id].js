// pages/posts/[id].js
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
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

  if (loading) return <Layout><p>Loading post...</p></Layout>;
  if (error) return <Layout><p>Error loading post.</p></Layout>;

  const { post } = data;

  return (
    <Layout>
      <article style={styles.article}>
        <h1 style={styles.title}>{post.title}</h1>
        <p style={styles.date}>
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} style={styles.featuredImage} />
        )}
        <div style={styles.content}>{post.content}</div>
        <div style={styles.meta}>
          <p>
            Categories:{" "}
            {post.categories?.map((cat) => cat.name).join(", ") || "None"}
          </p>
          <p>
            Tags: {post.tags?.map((tag) => tag.name).join(", ") || "None"}
          </p>
        </div>
      </article>
    </Layout>
  );
}

const styles = {
  article: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
    color: "#333",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  date: {
    fontSize: "0.9rem",
    color: "#777",
    marginBottom: "1.5rem",
  },
  featuredImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  content: {
    lineHeight: "1.6",
    fontSize: "1.1rem",
    marginBottom: "2rem",
  },
  meta: {
    fontSize: "0.9rem",
    color: "#555",
  },
};
