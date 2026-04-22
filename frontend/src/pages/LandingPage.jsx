import React from "react";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import logo from "../assets/strivo_black_logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-neutral-50 relative flex flex-col items-center antialiased selection:bg-indigo-100">
      {/* Autonomous Navigation Nodes */}
      {/* node 1: Scaled Identity (Left Corner) */}
      <div 
        onClick={() => navigate("/")} 
        className="fixed top-2 left-2 z-50 flex items-center justify-center  cursor-pointer group"
      >
        <img src={logo} alt="Strivo" className="w-20 h-20 object-contain" />
        <span className="text-neutral-900 font-bold font-satoshi text-4xl tracking-tighter pt-2 pb-2">Strivo</span>
      </div>

      {/* node 2: Actions (Right Corner) */}
      <nav className="fixed top-8 right-8 z-50 flex items-center gap-6 pl-5 pr-1.5 py-1.5 bg-white border border-neutral-200 rounded-full shadow-sm">
          <div className="flex items-center gap-4">
            <button className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors font-satoshi">
              Upvote
            </button>
            <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <Github size={14} />
            </a>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/login")}
              className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 font-satoshi px-1 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-[#1d88fe] text-white text-[11px] font-black px-5 py-2.5 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
            >
              Sign up
            </button>
          </div>
        </nav>
    </div>
  );
};

export default LandingPage;
