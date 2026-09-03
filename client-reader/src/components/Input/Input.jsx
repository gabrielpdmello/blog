import styles from "./Input.module.css";

function Input({ text, type = "text", name, handleChange }) {
  return (
    <span className={styles.wrapper}>
      <label htmlFor={name}>{text}</label>
      <input onChange={handleChange} type={type} id={name} name={name} />
    </span>
  );
}

export default Input;
