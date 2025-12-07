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
import { Link } from "react-router-dom";
import strivoLogo from "@/assets/strivo_black_logo.png";
import { useState } from "react";
import { useAuth } from "../ContentApi/AuthContext";
export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoggingIn } = useAuth();
  const handleSubmit = () => {
    const formData = {
      email: email,
      username: name,
      password: password,
    };
    login(formData);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        {/* -------- Updated Header (Same as SignupForm) -------- */}
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3">
            <img src={strivoLogo} alt="Strivo Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-black">Login</span>
          </div>
          <CardDescription className="text-black">
            Enter your email & password to continue
          </CardDescription>
        </CardHeader>
        {/* ------------------------------------------------------ */}

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="username"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder=""
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field className="flex flex-col gap-2">
                <Button type="submit">
                  {isLoggingIn ? "Logging in ...." : "Login"}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline text-white">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
