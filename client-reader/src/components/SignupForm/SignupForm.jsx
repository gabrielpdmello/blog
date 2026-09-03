import styles from "./SignupForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Error from "../../components/Error/Error";
import { Link } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
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

    const { [name]: deletedKey, ...newErrors } = errors;
    setErrors(newErrors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors();

    const controller = new AbortController();

    try {
      setIsSubmitting(true);
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw data.errors;
      }

      navigate("/login", { replace: true });
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
      <h2>Sign up</h2>

      <Input text="Name:" type="text" name="name" handleChange={handleChange} />
      {errors?.name && <Error text={errors.name} />}

      <Input
        text="Username:"
        type="text"
        name="username"
        handleChange={handleChange}
      />
      {errors?.username && <Error text={errors.username} />}

      <Input
        text="Password:"
        type="password"
        name="password"
        handleChange={handleChange}
      />
      {errors?.password && <Error text={errors.password} />}

      <Input
        text="Confirm Password:"
        type="password"
        name="confirmPassword"
        handleChange={handleChange}
      />
      {errors?.confirmPassword && <Error text={errors.confirmPassword} />}
      {errors?.abortError && <Error text={errors.abortError} />}
      {errors?.serverError && <Error text={errors.serverError} />}

      <span className={styles.submit}>
        <Button text="Enter" type="submit" disabled={isSubmitting} />
      </span>

      <span className={styles["have-account"]}>
        <span>Already have an account?</span>
        <Link to="/login">Login</Link>
      </span>
    </form>
  );
}

export default SignupForm;
