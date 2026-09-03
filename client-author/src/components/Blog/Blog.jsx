import styles from "./Blog.module.css";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Comments from "../Comments/Comments";
import AddComment from "../AddComment/AddComment";
import LocalizedDate from "../LocalizedDate/LocalizedDate";
import Loading from "../Loading/Loading";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../Button/Button";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function Blog() {
  const { postId } = useParams();
  const [blogPost, setBlogPost] = useState();
  const [blogPostLoading, setBlogPostLoading] = useState(true);

  const [blogComments, setBlogComments] = useState([]);
  const [blogCommentsLoading, setBlogCommentsLoading] = useState(true);
  const [blogCommentsError, setBlogCommentsError] = useState();

  const [error, setError] = useState();

  const { request } = useApi();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const id = Number(postId);
        if (Number.isNaN(id)) {
          navigate("/404", { replace: false });
          return;
        }

        // fetch post
        const response = await request(`${apiUrl}/posts/${postId}`);
        if (!response.ok) {
          if (response.status === 404) {
            const err = new Error("Not Found");
            err.status = 404;
            throw err;
          }
          throw new Error("Server error");
        }
        const data = await response.json();
        setBlogPost(data);
      } catch (err) {
        if (err.status === 404) {
          navigate("/404", { replace: false });
        }
        setError(err);
      } finally {
        setBlogPostLoading(false);
      }
    }

    load();
  }, []);

  // fetch comments from blog post
  useEffect(() => {
    async function load() {
      try {
        if (token) {
          const response = await fetch(`${apiUrl}/posts/${postId}/comments`);
          if (!response.ok) throw new Error("Server error");
          const data = await response.json();
          setBlogComments(data);
        }
      } catch (err) {
        setBlogCommentsError(err);
      } finally {
        setBlogCommentsLoading(false);
      }
    }

    load();
  }, []);

  if (blogPostLoading) {
    return (
      <div className={styles["loading-wrapper"]}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>A network error was encountered</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles["btn-container"]}>
        <Button text="Edit" type="link" to={`/posts/${postId}/edit`} />
      </div>
      <article className={styles["blog-post"]}>
        <h1>{blogPost.title}</h1>
        <span className={styles["blog-meta"]}>
          <span>{blogPost.author.name}</span>
          {blogPost.is_published && (
            <span>
              {", at "}
              <LocalizedDate timestamp={blogPost.published_at} />
            </span>
          )}
        </span>
        <div className={styles["blog-content"]}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {blogPost.content}
          </Markdown>
        </div>
        <h2>Comments ({blogComments.length})</h2>
        <AddComment postId={postId} setComments={setBlogComments} />
        {blogCommentsLoading && (
          <div className={styles["loading-wrapper"]}>
            <Loading />
          </div>
        )}
        {blogCommentsError && <p>Error fetching comments.</p>}

        {!blogCommentsLoading && !blogCommentsError && (
          <Comments
            comments={blogComments}
            setComments={setBlogComments}
            postAuthorId={blogPost.author_id}
          />
        )}
      </article>
    </div>
  );
}

export default Blog;
