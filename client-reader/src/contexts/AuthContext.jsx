import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(() => {
    if (!storedToken) return null;

    if (isTokenExpired(storedToken)) {
      localStorage.removeItem("token");
      return null;
    }
    return storedToken;
  });

  function login(token) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return <AuthContext value={{ token, login, logout }}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
