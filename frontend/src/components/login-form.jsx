import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import strivoWhiteLogo from "@/assets/strivo_white_logo.png";
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
        "flex flex-col items-center w-full max-w-[350px] gap-10 py-4",
        className,
      )}
      {...props}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-2">
        <img
          src={strivoWhiteLogo}
          alt="Strivo Logo"
          className="w-40 h-40 object-contain"
        />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            Login
          </h1>
          <p className="text-white/60 font-medium text-sm">
            Simple, beautiful video analytics.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-6"
      >
        <div className="w-full space-y-4">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-11 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all font-bold"
            required
          />
          <Input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className="h-11 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all font-bold"
            required
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all font-bold"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoggingIn}
          className="px-12 h-12 rounded-2xl bg-[#f18d40] hover:bg-[#fd8732] text-white font-bold text-base transition-all duration-300 border-none w-fit shadow-none"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Footer Section */}
      <div className="w-full flex flex-col gap-4">
        <p className="text-center text-white/60 font-medium text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-white font-light hover:underline opacity-60 hover:opacity-100 transition-all duration-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
