import styles from "./Comments.module.css";
import LocalizedDate from "../LocalizedDate/LocalizedDate";
import { useApi } from "../../hooks/useApi";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function Comments({ comments, setComments, postAuthorId, currentUser }) {
  const { request } = useApi();
  const [deletting, setDeletting] = useState(false);

  async function handleDelete(e, commentId) {
    e.preventDefault();
    const controller = new AbortController();

    try {
      setDeletting(true);
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await request(`${apiUrl}/comments/${commentId}`, {
        method: "DELETE",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const data = await response.json();
        throw data;
      }
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      if (err.name === "AbortError") {
        alert("Error deleting comment: Request expired. Try again!");
      } else if (err.name === "TypeError") {
        alert("Error deleting comment: Couldn't connect to server.");
      } else {
        alert("Error deleting comment.");
      }
    } finally {
      setDeletting(false);
    }
  }

  if (comments.length === 0) {
    return <p>No comments</p>;
  }

  return (
    <section>
      {comments.map((comment) => (
        <article className={styles["comment"]} key={comment.id}>
          <span className={styles["comment-header"]}>
            <span>
              {comment.author.name} (@
              {comment.author.username}){" "}
              {postAuthorId === comment.author.id && <i>Author</i>}
            </span>
            <span>
              at <LocalizedDate timestamp={comment.created_at} />
            </span>
          </span>
          <span className={styles["content"]}>{comment.content}</span>
          {currentUser?.id === comment.user_id && (
            <form
              onSubmit={(e) => {
                handleDelete(e, comment.id);
              }}
            >
              <button
                className={styles["delete-btn"]}
                type="submit"
                title="Delete comment"
                disabled={deletting}
              >
                <span className={styles["delete-icon"]}>🗑</span>
                <span className={styles["delete-text"]}>Delete</span>
              </button>
            </form>
          )}
        </article>
      ))}
    </section>
  );
}

export default Comments;
