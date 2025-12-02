import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Strivo</h1>
        <p className="text-lg text-gray-600">Get started with your journey</p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/register")}
            className="px-6 py-2 text-base"
            variant="outline"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-base"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
