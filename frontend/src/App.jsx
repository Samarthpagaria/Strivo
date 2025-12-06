// App.jsx (or App.tsx)
import { RouterProvider } from "react-router-dom";
import { router } from "./route/router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProvider } from "./ContentApi/GlobalProvider";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
