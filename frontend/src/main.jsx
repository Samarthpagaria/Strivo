import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*
Initializing router in the project 
1.Add RouterProvider in app.jsx
2.create route folder and router.jsx file
3.import createBrowserRouter in app.jsx
4.create router in router.jsx file
5.use router in app.jsx
*/
