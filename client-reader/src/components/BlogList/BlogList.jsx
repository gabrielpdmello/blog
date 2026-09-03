import styles from "./BlogList.module.css";
import LocalizedDate from "../LocalizedDate/LocalizedDate";
import { useNavigate } from "react-router";
import Loading from "../Loading/Loading";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  function handleClick(id) {
    navigate(`/posts/${id}`);
  }

  async function fetchData() {
    try {
      const response = await fetch(`${apiUrl}/posts`);
      
      if (!response.ok) {
        throw response
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <p>A network error was encountered</p>;

  if (loading)
    return (
      <div className={styles["loading-wrapper"]}>
        <Loading />
      </div>
    );

  return (
    <section className={styles["blog-list-container"]}>
      <h2>Welcome!</h2>
      <p>
        This blog is a project from The Odin Project to learn how to build a
        REST API!
      </p>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <article
            key={blog.id}
            className={styles["blog-item"]}
            onClick={() => handleClick(blog.id)}
          >
            <h3>{blog.title}</h3>
            {blog.published_at && (
              <LocalizedDate timestamp={blog.published_at} />
            )}
            <p>{blog.intro}</p>
            <span className={styles["link"]}>Read more</span>
          </article>
        ))
      ) : (
        <p>No blog posts found.</p>
      )}
    </section>
  );
}

export default BlogList;
