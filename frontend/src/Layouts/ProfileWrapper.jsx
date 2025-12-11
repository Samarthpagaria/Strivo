import React from "react";
import ChannelProfile from "../pages/ChannelProfile";
import { ProfileProvider } from "../ContentApi/ProfileContext";
import { useParams } from "react-router-dom";
const ProfileWrapper = () => {
    const { username } = useParams();
  return (
    <ProfileProvider username={username}>
      <ChannelProfile />
    </ProfileProvider>
  );
};

export default ProfileWrapper;
