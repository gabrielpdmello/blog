import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import RootLayout from "./layouts/RootLayout/RootLayout.jsx";
import ClientError from "./layouts/ClientError/ClientError.jsx";
import BlogList from "./components/BlogList/BlogList.jsx";
import Blog from "./components/Blog/Blog.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import NewPost from "./components/NewPost/NewPost.jsx";
import EditPost from "./components/EditPost/EditPost.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function HomeRedirect() {
  const { token } = useAuth();

  return token ? (
    <Navigate to="/posts" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    ErrorBoundary: ClientError,
    children: [
      { index: true, element: <HomeRedirect /> },

      {
        path: "posts",
        element: (
          <ProtectedRoute>
            <BlogList />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:postId",
        element: (
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <LoginForm /> },
      {
        path: "posts/new",
        element: (
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:postId/edit",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>,
);
