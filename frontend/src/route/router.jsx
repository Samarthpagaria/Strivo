import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home.Page";
import Register from "../pages/Register";
import LayoutAuth from "../Layouts/AuthLayout";
import RootLayout from "../Layouts/RootLayout";
import PrivateRoute from "../utils/PrivateRoute";
import Notifications from "../pages/Notifications.Page";
import Subscriptions from "../pages/Subscriptions.Page";
import Playlists from "../pages/Playlists.Page";
import LikedVideos from "../pages/LikedVideos.Page";
import LikedTweets from "../pages/LikedTweets.Page";
import WatchHistory from "../pages/WatchHistory";
import Docs from "../pages/Docs.Page";
import SupportPage from "../pages/Support.Page";
import SettingsPage from "../pages/Settings.Page";
import Results from "../pages/Results.Page";
import VideoDetailsPage from "../pages/VideoDetails.Page";
import ProfileWrapper from "../Layouts/ProfileWrapper";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // This makes it the default route when path is exactly "/"
        element: <Home />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "subscriptions",
        element: <Subscriptions />,
      },
      { path: "playlists", element: <Playlists /> },
      { path: "liked_videos", element: <LikedVideos /> },
      { path: "liked_tweets", element: <LikedTweets /> },
      { path: "history", element: <WatchHistory /> },
      { path: "docs", element: <Docs /> },
      { path: "support", element: <SupportPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: `results`, element: <Results /> },
      { path: "watch/:videoId", element: <VideoDetailsPage /> },
      { path: "/@:username", element: <ProfileWrapper /> },
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
