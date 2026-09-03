import styles from "./AddComment.module.css";
import Button from "../Button/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import Error from "../Error/Error";
const apiUrl = import.meta.env.VITE_API_URL;

function AddComment({ postId, setComments }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    comment: "",
    postId: postId,
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    async function load() {
      try {
        if (token) {
          const response = await request(`${apiUrl}/users/me`);
          if (!response.ok) throw new Error("Server error");
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (err) {
        setErrors(err);
      } finally {
        setCurrentUserLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors();

    const controller = new AbortController();

    try {
      setIsSending(true);
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await request(`${apiUrl}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json();
      if (!response.ok) {
        throw data.errors;
      }

      data.author = currentUser;
      setComments((prev) => [...prev, data]);
      setFormData((prev) => ({ ...prev, comment: "" }));
    } catch (err) {
      if (err.name === "AbortError") {
        setErrors({ abortError: "Request expired. Try again." });
      } else if (err.name === "TypeError") {
        setErrors({ serverError: "Couldn't connect to server." });
      } else {
        setErrors(err);
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (!token)
    return (
      <p className={styles["sign-out"]}>
        You must be signed in to post comments. <Link to="/login">Login</Link>{" "}
        or <Link to="/signup">signup</Link>.
      </p>
    );

  if (errors) {
    <p>A network error was encountered</p>;
  }

  if (currentUserLoading) {
    return;
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className={styles["comment-text"]}
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        minLength={1}
        maxLength={500}
      />
      {errors?.comment && <Error text={errors.comment} />}
      {errors?.abortError && <Error text={errors.abortError} />}
      {errors?.serverError && <Error text={errors.serverError} />}
      <div className={styles["add-button-wrapper"]}>
        <Button type="submit" text="Add comment" disabled={isSending} />
      </div>
    </form>
  );
}

export default AddComment;
