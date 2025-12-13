// App.jsx (or App.tsx)
import { RouterProvider } from "react-router-dom";
import { router } from "./route/router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProvider } from "./ContentApi/GlobalContext";
import { SearchProvider } from "./ContentApi/SearchContext";
import { AuthProvider } from "./ContentApi/AuthContext";
import { ToastProvider } from "./ContentApi/ToastContext";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
            <ToastProvider>
        <SearchProvider>
          <GlobalProvider>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
          </GlobalProvider>
        </SearchProvider>
            </ToastProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
