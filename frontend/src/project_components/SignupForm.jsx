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
import { Link } from "react-router-dom";

export function SignupForm({ className, ...props }) {
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                <Input id="avatar" type="file" accept="image/*" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="coverImage">
                  Cover Image (optional)
                </FieldLabel>
                <Input id="coverImage" type="file" accept="image/*" />
              </Field>

              <Field>
                <Button type="submit">Sign Up</Button>
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
