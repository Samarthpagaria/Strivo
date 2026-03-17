import { Home, User, Briefcase } from "lucide-react";
import { useTweet } from "../ContentApi/TweetContext";
import { NavBar } from "../components/ui/tubelight-navbar";

const TweetNavbar = ({ className, scrollContainerRef }) => {
  const { activeTab, setActiveTab } = useTweet();

  const navItems = [
    { name: "For You", id: "for-you", icon: Home },
    { name: "Following", id: "following", icon: User },
    { name: "Me", id: "me", icon: Briefcase },
  ];

  // Map the items to include the id for active tracking
  const itemsWithIds = navItems.map((item) => ({
    ...item,
    url: "#", // Don't use Link navigation since we are switching tabs internally
  }));

  return (
    <NavBar
      items={itemsWithIds}
      activeTab={activeTab}
      onTabChange={(name) => {
        const item = navItems.find((i) => i.name === name);
        if (item) setActiveTab(item.id);
      }}
      scrollContainerRef={scrollContainerRef}
      className={className}
    />
  );
};

export default TweetNavbar;
