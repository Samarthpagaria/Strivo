import React from "react";
import logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { useState } from "react";
import { useSearch } from "../ContentApi/SearchContext";

const Header = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/results?q=${searchQuery}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 container mx-auto">
        <div onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="strivo logo"
            className="w-20 h-16 "
            draggable="false"
          />
        </div>
        <div className="flex-1 max-w-2xl px-4">
          <div className="flex items-center max-w-xl mx-auto bg-gray-100 rounded-full px-4 py-2">
            <Search className="text-gray-500 mr-2 h-5 w-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
        <div>
          {/* IF not logged in then twitter navigation menu  [for You , Following,Me] and  two buttons of signup and sign in  */}
          {/* if logged in then profile icon and twitter navigation menu  [for You , Following,Me] */}
          <div className="flex items-center gap-4">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="px-6 py-2 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => navigate("/login")}
            >
              Sign In
            </HoverBorderGradient>
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="px-6 py-2 bg-black text-sm font-medium text-white hover:bg-gray-800"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </HoverBorderGradient>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
