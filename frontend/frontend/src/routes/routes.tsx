import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage  from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import App from "@/App";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardHome from "@/pages/DashboardHome";
import BooksPage from "@/pages/BooksPage";
import AuthorsPage from "@/pages/Authorspage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "books", element: <BooksPage /> },
              { path: "authors", element: <AuthorsPage /> },
            ],
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      { index: true, element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);