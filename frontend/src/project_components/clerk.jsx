import React from "react";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/clerk-react";

const Clerk = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
          Welcome to Strivo
        </h2>
        <div className="space-y-6">
          <SignedOut>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none w-full",
                  headerTitle: "text-amber-800",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton:
                    "border-amber-300 hover:bg-amber-50",
                  socialButtonsBlockButtonText: "text-gray-700",
                  dividerLine: "bg-amber-200",
                  dividerText: "text-amber-800",
                  formFieldInput:
                    "border-amber-300 focus:ring-2 focus:ring-amber-200",
                  formButtonPrimary:
                    "bg-amber-600 hover:bg-amber-700 text-white",
                  footerActionText: "text-amber-800",
                  footerActionLink: "text-amber-600 hover:text-amber-800",
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
            />
          </SignedOut>
          <SignedIn>
            <div className="text-center">
              <p className="mb-4 text-amber-800">You're signed in!</p>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Clerk;
