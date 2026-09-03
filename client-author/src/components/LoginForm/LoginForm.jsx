import styles from "./LoginForm.module.css";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Error from "../Error/Error";
const apiUrl = import.meta.env.VITE_API_URL;

function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors();

    const controller = new AbortController();

    try {
      setIsSubmitting(true);
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${apiUrl}/session/login`, {
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

      if (!data.user.is_blog_author) {
        throw { notAuthor: "Unauthorized." };
      }

      login(data.token);
      navigate("/posts", { replace: true });
    } catch (err) {
      if (err.name === "AbortError") {
        setErrors({ abortError: "Request expired. Try again." });
      } else if (err.name === "TypeError") {
        setErrors({ serverError: "Couldn't connect to server." });
      } else {
        setErrors(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <p className={styles.desc}>to create and manage posts.</p>

      <Input
        text="Username:"
        type="text"
        name="username"
        handleChange={handleChange}
      />
      <Input
        text="Password:"
        type="password"
        name="password"
        handleChange={handleChange}
      />

      {errors?.username && <Error text={errors.username} />}
      {errors?.password && <Error text={errors.password} />}
      {errors?.notAuthor && <Error text={errors.notAuthor} />}
      {errors?.abortError && <Error text={errors.abortError} />}
      {errors?.serverError && <Error text={errors.serverError} />}

      <span className={styles.submit}>
        <Button text="Enter" type="submit" disabled={isSubmitting} />
      </span>
    </form>
  );
}

export default LoginForm;
