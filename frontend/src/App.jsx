// App.jsx (or App.tsx)
import { RouterProvider } from "react-router-dom";
import { router } from "./route/router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProvider } from "./ContentApi/GlobalContext";
import { SearchProvider } from "./ContentApi/SearchContext";
import { AuthProvider } from "./ContentApi/AuthContext";
import { ToastProvider } from "./ContentApi/ToastContext";
import { MyChannelProvider } from "./ContentApi/myChannelContext";
import { PlaylistProvider } from "./ContentApi/PlaylistContext";
import { SettingProvider } from "./ContentApi/SettingContext";
import { VideoProvider } from "./ContentApi/VideoContext";
import { VideoDetailProvider } from "./ContentApi/VideoDetailContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SearchProvider>
            <GlobalProvider>
              <VideoProvider>
                <MyChannelProvider>
                  <PlaylistProvider>
                    <VideoDetailProvider>
                      <AuthProvider>
                        <SettingProvider>
                          <RouterProvider router={router} />
                        </SettingProvider>
                      </AuthProvider>
                    </VideoDetailProvider>
                  </PlaylistProvider>
                </MyChannelProvider>
              </VideoProvider>
            </GlobalProvider>
          </SearchProvider>
        </ToastProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
