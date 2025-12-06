import React from "react";
import { Home, User, Briefcase, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { NavBar } from "../components/ui/tubelight-navbar";
const TweetNavbar = ({ className }) => {
  const navItems = [
    { name: "For You", url: "/", icon: Home },
    { name: "Following", url: "/", icon: User },
    { name: "Me", url: "/", icon: Briefcase },
  ];

  return <NavBar items={navItems} className={className} />;
};

export default TweetNavbar;
