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
import SignupForm from "./components/SignupForm/SignupForm.jsx";
import Protected from "./components/Protected/Protected.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    ErrorBoundary: ClientError,
    children: [
      { index: true, element: <BlogList /> },
      {
        path: "posts/:postId",
        element: <Blog />,
      },
      { path: "login", element: <LoginForm /> },
      { path: "signup", element: <SignupForm /> },
      {
        path: "protected",
        element: (
          <ProtectedRoute>
            <Protected />
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
