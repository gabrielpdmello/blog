import styles from "./EditPost.module.css";
import Button from "../Button/Button";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import Input from "../Input/Input";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import Editor from "../Editor/Editor";
const apiUrl = import.meta.env.VITE_API_URL;

function EditPost() {
  const { postId } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogPost, setBlogPost] = useState();
  const [error, setError] = useState();
  const editorRef = useRef(null);
  const inputTitleRef = useRef(null);
  const inputIntroRef = useRef(null);
  const { request } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const id = Number(postId);
        if (Number.isNaN(id)) {
          navigate("/404", { replace: false });
          return;
        }

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
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit() {
    const controller = new AbortController();

    try {
      setSubmitting(true);
      const markdown = editorRef.current?.getMarkdown();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const body = {
        title: inputTitleRef.current?.value,
        intro: inputIntroRef.current?.value,
        isPublished: blogPost.is_published,
        content: markdown,
      };

      const response = await request(`${apiUrl}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      let data = await response.json();

      if (!response.ok) {
        data.status = response.status;
        throw data;
      }

      setBlogPost(data);
      alert("Post saved!");
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        alert(err.message);
      } else if (err.status === 404) {
        alert("Post not found. ");
      } else if (err?.name === "AbortError") {
        alert("Request expired. Try again.");
      } else if (err?.name === "TypeError") {
        alert("Couldn't connect to server.");
      } else {
        alert("Internal server error.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(e) {
    e.preventDefault();
    const controller = new AbortController();
    setError();
    const newStatus = blogPost.is_published === true ? false : true;

    try {
      setSubmitting(true);

      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await request(`${apiUrl}/posts/${postId}/publish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: newStatus,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const data = await response.json();
        throw data;
      }

      setBlogPost((prev) => ({
        ...prev,
        is_published: newStatus,
        published_at: new Date(),
      }));
    } catch (err) {
      if (err.name === "AbortError") {
        setError({ abortError: "Request expired. Try again." });
      } else if (err.name === "TypeError") {
        setError({ serverError: "Couldn't connect to server." });
      } else {
        setError(err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    setError();
    const controller = new AbortController();

    try {
      setSubmitting(true);
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await request(`${apiUrl}/posts/${postId}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const data = await response.json();
        throw data;
      }
      navigate("/posts", { replace: true });
    } catch (err) {
      if (err.name === "AbortError") {
        alert("Error deleting post: Request expired. Try again!");
      } else if (err.name === "TypeError") {
        alert("Error deleting post: Couldn't connect to server.");
      } else {
        alert("Error deleting post.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles["loading-wrapper"]}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <p className={styles.error}>A network error was encountered</p>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Post</h1>
          <div className={styles["btn-container"]}>
            <Button type="link" to={`/posts/${postId}`} text="View post" />
            <Button
              text="Save"
              onClick={handleSubmit}
              disabled={submitting}
            />
            <form onSubmit={handleDelete}>
              <Button type="submit" text="Delete" disabled={submitting} />
            </form>
            <form onSubmit={handlePublish}>
              <Button
                type="submit"
                text={blogPost.is_published ? "Unpublish" : "Publish"}
                disabled={submitting}
              />
            </form>
          </div>
        </div>
        <form>
          <Input
            ref={inputTitleRef}
            text="Blog Title:"
            name="title"
            defaultValue={blogPost.title ?? ""}
          />
          <Input
            ref={inputIntroRef}
            text="Intro:"
            type="textarea"
            name="intro"
            placeholder={
              "This is what users will see before clicking your post."
            }
            defaultValue={blogPost.intro ?? ""}
          />
        </form>
        <div className={styles["editor-wrapper"]}>
          <Editor ref={editorRef} markdown={blogPost.content} />
        </div>
      </div>
    </>
  );
}

export default EditPost;
