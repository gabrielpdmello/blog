import { useAuth } from "../contexts/AuthContext";

// centralized function to make authenticated requests
async function api(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export function useApi() {
  const { token, logout } = useAuth();
  async function request(url, options = {}, autoLogout=true) {
    const response = await api(url, token, options);
    if (response.status === 401 && autoLogout) {
      // unauthorized
      logout();
      return null;
    }
    return response;
  }

  return { request };
}
