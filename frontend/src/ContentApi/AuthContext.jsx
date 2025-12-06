import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      sessionStorage.setItem("sessionActive", "true");
      return JSON.parse(localUser);
    }
    return null;
  });
  console.log("Final user Date: ", user);
  const [token, setToken] = useState(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !sessionStorage.getItem("sessionActive")) {
      sessionStorage.setItem("sessionActive", "true")
    }
    return localToken;
  });
};
