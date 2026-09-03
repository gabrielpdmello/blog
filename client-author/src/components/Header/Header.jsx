import styles from "./Header.module.css";
import Button from "../Button/Button.jsx";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext.jsx";

function Header() {
  const { logout, token } = useAuth();

  return (
    <header className={styles.header}>
      <span className={styles.logo}>
        <Link to="/">My Blog</Link>
      </span>
      {token == null ? (
        <span className={styles["btn-container"]}>
          <Button text="Login" type="link" to="/login" variant="outline" />
        </span>
      ) : (
        <Button text="Logout" onClick={logout} variant="outline" />
      )}
    </header>
  );
}

export default Header;
