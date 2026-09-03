import styles from "./NewPost.module.css";
import Button from "../Button/Button";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import Input from "../Input/Input";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import Editor from "../Editor/Editor";

function NewPost() {
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef(null);
  const inputTitleRef = useRef(null);
  const inputIntroRef = useRef(null);
  const { request } = useApi();
  const navigate = useNavigate();

  async function handleSubmit(isPublished) {
    const controller = new AbortController();

    try {
      setSubmitting(true);
      const markdown = editorRef.current?.getMarkdown();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const body = {
        title: inputTitleRef.current?.value,
        intro: inputIntroRef.current?.value,
        isPublished: isPublished,
        content: markdown,
      };

      const response = await request(
        `${apiUrl}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
        false,
      );
      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const error = data;
          error.status = 400;
          throw error;
        } else if (response.status === 401) {
          const error = { message: "Unauthorized" };
          error.status = 401;
          throw error;
        }
        throw data;
      }

      alert("Post created!");
      navigate(`/posts/${data.id}`);
    } catch (err) {
      if (err.status === 400) {
        alert(err.message);
      } else if (err.status === 401) {
        alert(
          "Token is expired. Save the text manually, or else it will be lost!",
        );
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>New Post</h1>
          <div className={styles["btn-container"]}>
            <Button
              text="Save"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            />
            <Button
              text="Save and publish"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
            />
          </div>
        </div>
        <form>
          <Input ref={inputTitleRef} text="Blog Title:" name="title" />
          <Input
            ref={inputIntroRef}
            text="Intro:"
            type="textarea"
            name="intro"
            placeholder={
              "This is what users will see before clicking your post."
            }
          />
        </form>
        <div className={styles["editor-wrapper"]}>
          <Editor ref={editorRef} markdown="" />
        </div>
      </div>
    </>
  );
}

export default NewPost;
