import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import strivoWhiteLogo from "@/assets/strivo_white_logo.png";
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
          <h1 className="text-3xl font-satoshi font-medium text-left text-white drop-shadow-sm">
            Create Your Account to <br></br>Unleash Your Dreams
          </h1>
          <p className="font-inter text-white/60 text-sm text-left">
            Step into your creator space.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-6"
      >
        <div className="w-full space-y-4">
          <Input
            id="fullName"
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
            className="h-11 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all font-bold"
            required
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email address"
            className="h-11 rounded-2xl border-none bg-white/10 px-6 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all font-bold"
            required
          />
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="avatar"
                className="text-[10px] uppercase tracking-wider font-bold text-white/40 ml-4"
              >
                Avatar
              </label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="h-11 rounded-2xl border-none bg-white/10 px-4 text-[10px] text-white file:hidden pt-4 cursor-pointer font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="coverImage"
                className="text-[10px] uppercase tracking-wider font-bold text-white/40 ml-4"
              >
                Cover (Optional)
              </label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="h-11 rounded-2xl border-none bg-white/10 px-4 text-[10px] text-white file:hidden pt-4 cursor-pointer font-bold"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isRegistering}
          className="px-12 h-12 rounded-2xl bg-[#fb8934] hover:bg-[#e57a2e] text-white font-bold text-base transition-all duration-300 border-none w-fit shadow-none"
        >
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </form>

      <div className="w-full flex flex-col gap-6">
        <p className="text-center text-white/60 font-medium text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-light hover:underline opacity-60 hover:opacity-100 transition-all duration-300"
          >
            Login
          </Link>
        </p>

        <p className="px-6 text-center text-[10px] text-white/40 leading-relaxed">
          By clicking continue, you agree to our{" "}
          <Link
            to="/terms"
            className="underline hover:text-white transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
