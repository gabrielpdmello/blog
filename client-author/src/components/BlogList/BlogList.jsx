import styles from "./BlogList.module.css";
import LocalizedDate from "../LocalizedDate/LocalizedDate";
import { Link } from "react-router";
import Loading from "../Loading/Loading";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import Button from "../Button/Button";
const apiUrl = import.meta.env.VITE_API_URL;

function BlogListHeader({ status, setStatus }) {
  return (
    <header>
      <div className={styles["btn-container"]}>
        <h2>Your blog posts</h2>
        <Button type="link" to="/posts/new" text="Create post" />
      </div>

      <div className={styles["filter-status"]}>
        <label htmlFor="status">Filter by status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>
    </header>
  );
}

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const { request } = useApi();

  async function fetchData() {
    const controller = new AbortController();
    setError();

    try {
      setLoading(true);
      const timeout = setTimeout(() => controller.abort(), 8000);

      const url =
        status === "all"
          ? `${apiUrl}/posts`
          : `${apiUrl}/posts?status=${status}`;
      const response = await request(url, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setBlogs(data);
    } catch (err) {
      if (err.name === "AbortError") {
        setError({ abortError: "Request expired. Try again." });
      } else if (err.name === "TypeError") {
        setError({ serverError: "Couldn't connect to server." });
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [status]);

  if (loading) {
    return (
      <section className={styles["blog-list-container"]}>
        <BlogListHeader status={status} setStatus={setStatus} />
        <div className={styles["loading-wrapper"]}>
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles["blog-list-container"]}>
        <BlogListHeader status={status} setStatus={setStatus} />
        <p>A network error was encountered</p>
      </section>
    );
  }

  return (
    <section className={styles["blog-list-container"]}>
      <BlogListHeader status={status} setStatus={setStatus} />

      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <article key={blog.id} className={styles["blog-item"]}>
            <Link to={`/posts/${blog.id}/edit`} className={styles["edit-btn"]}>
              <span className={styles["edit-icon"]}>✎</span>
              <span className={styles["edit-text"]}>Edit post</span>
            </Link>
            <Link to={`/posts/${blog.id}`} className={styles["article-link"]}>
              <h3>{blog.title}</h3>
              {blog.is_published && (
                <LocalizedDate timestamp={blog.published_at} />
              )}
              {!blog.is_published && (
                <p className={styles["not-published"]}>Not published</p>
              )}
              <p>{blog.intro}</p>
              <span className={styles["link"]}>Read more</span>
            </Link>
          </article>
        ))
      ) : (
        <p>
          No blog posts found. <Link to="/posts/new">Create a new post!</Link>
        </p>
      )}
    </section>
  );
}

export default BlogList;
