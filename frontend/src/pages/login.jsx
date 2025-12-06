import React from "react";
import LoginCard from "../project_components/LoginCard";
import { LoginForm } from "../components/login-form";
const Login = () => {
  return (
    <div className="bg-gradient-to-br from-[#799191] via-[rgba(238,119,22,0.86)] to-[#13282b] flex min-h-screen w-full">
      <div className=" w-1/2 flex items-center justify-center min-h-screen">
        <LoginCard />
      </div>
      <div
        className=" w-1/2 flex flex-col items-center justify-center m-2 rounded-2xl 
"
      >
        {/* sign in component */}
        <LoginForm className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default Login;
