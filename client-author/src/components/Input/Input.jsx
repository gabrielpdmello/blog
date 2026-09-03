import styles from "./Input.module.css";

import { forwardRef } from "react";

const Input = forwardRef(
  ({ text, type = "text", name, placeholder, handleChange, defaultValue="" }, ref) => {
    if (type === "textarea") {
      return (
        <span className={styles.container}>
          <label htmlFor={name}>{text}</label>
          <textarea
            ref={ref}
            onChange={handleChange}
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
        </span>
      );
    }

    return (
      <span className={styles.container}>
        <label htmlFor={name}>{text}</label>
        <input
          ref={ref}
          onChange={handleChange}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </span>
    );
  },
);

export default Input;
