import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import strivoBlackLogo from "@/assets/strivo_black_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../ContentApi/AuthContext";

export function SignupForm({ className, ...props }) {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    await register(formData);
    navigate("/");
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full max-w-[440px] gap-6 p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
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
            Create Account
          </h1>
          <p className="font-inter text-neutral-500 font-light text-sm">
            Step into your creator space.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-8 mt-2"
      >
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="fullName"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Full Name"
              className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-900 transition-all font-light shadow-none text-sm"
              required
            />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-neutral-900 transition-all font-light shadow-none text-sm"
              required
            />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email address"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="avatar"
                className="text-[10px] uppercase tracking-wider font-medium text-neutral-500 ml-1"
              >
                Avatar
              </label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-[10px] text-neutral-900 file:hidden pt-2 cursor-pointer font-light shadow-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="coverImage"
                className="text-[10px] uppercase tracking-wider font-medium text-neutral-500 ml-1"
              >
                Cover
              </label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="h-10 rounded-none border-0 border-b border-neutral-200 bg-transparent px-1 text-[10px] text-neutral-900 file:hidden pt-2 cursor-pointer font-light shadow-none"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isRegistering}
          className="w-full h-11 rounded-xl bg-[#fe4524] hover:bg-[#e03c1f] text-white font-medium text-sm transition-all duration-300 border-none shadow-sm"
        >
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </form>

      <div className="w-full flex flex-col gap-4 mt-2">
        <p className="text-center text-neutral-500 font-light text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-900 font-medium hover:underline transition-all duration-300"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-[10px] text-neutral-400 leading-relaxed font-light">
          By clicking continue, you agree to our{" "}
          <Link
            to="/terms"
            className="underline hover:text-neutral-900 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline hover:text-neutral-900 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
