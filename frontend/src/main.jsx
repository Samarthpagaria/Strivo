import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import { ClerkProvider } from "@clerk/clerk-react";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
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
