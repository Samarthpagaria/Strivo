import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import strivoBlackLogo from "@/assets/strivo_black_logo.png";
import { useState } from "react";
import { useAuth } from "../ContentApi/AuthContext";
import { useNavigate } from "react-router-dom";
export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      username: name,
      password: password,
    };
    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full max-w-[360px] gap-6 p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
        className,
      )}
      {...props}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-1">
        <img
          src={strivoBlackLogo}
          alt="Strivo Logo"
          className="w-20 h-20 object-contain mb-2"
        />
        <div className="space-y-1">
          <h1 className="font-satoshi text-2xl tracking-tight text-neutral-900 font-medium">
            Welcome Back
          </h1>
          <p className="font-inter text-neutral-500 font-light text-sm">
            Where ideas post, and stories stream.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-8 mt-2"
      >
        <div className="w-full space-y-4">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-900 transition-all font-light shadow-none text-sm"
            required
          />
          <Input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-900 transition-all font-light shadow-none text-sm"
            required
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-900 transition-all font-light shadow-none text-sm"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoggingIn}
          className="w-full h-11 rounded-xl bg-[#fe4524] hover:bg-[#e03c1f] text-white font-medium text-sm transition-all duration-300 border-none shadow-sm"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Footer Section */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <p className="text-center text-neutral-500 font-light text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-neutral-900 font-medium hover:underline transition-all duration-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
