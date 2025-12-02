import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import LayoutAuth from "../Layouts/AuthLayout";
import RootLayout from "../Layouts/RootLayout";
import PrivateRoute from "../utils/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // This makes it the default route when path is exactly "/"
        element: <Home />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutAuth />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
