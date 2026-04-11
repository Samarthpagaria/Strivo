import React from "react";
import LoginCard from "../project_components/LoginCard";
import { LoginForm } from "../components/login-form";
const Login = () => {
  return (
    <div className="bg-gradient-to-br from-[#799191] via-[rgba(238,119,22,0.86)] to-[#13282b] flex min-h-screen w-full">
      {/* Left side: Decorative Logo Card */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-4">
        <LoginCard />
      </div>

      {/* Right side: New Minimalist LoginForm sitting directly on background */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <LoginForm className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default Login;
