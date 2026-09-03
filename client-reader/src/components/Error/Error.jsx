import styles from "./Error.module.css";

function Error({ text }) {
  return <p className={styles.error}>{text}</p>;
}

export default Error