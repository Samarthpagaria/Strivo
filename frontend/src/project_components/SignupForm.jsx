import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import strivoLogo from "@/assets/strivo_black_logo.png";
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 ">
            <img src={strivoLogo} alt="Strivo Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-black">Create account</span>
          </div>
          <CardDescription className="text-black">
            Enter your details below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="coverImage">
                  Cover Image (optional)
                </FieldLabel>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </Field>

              <Field>
                <Button type="submit">
                  {isRegistering ? "Registering..." : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-white">
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Bottom Terms Section */}
      <FieldDescription className="px-6 text-center text-white">
        By clicking continue, you agree to our{" "}
        <Link to="/terms" className="underline text-white">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline text-white">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
