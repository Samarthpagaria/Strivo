import React from "react";
import gradient_image from "../assets/gradeint_image.jpg";
import logo from "../assets/strivo_white_logo.png";
import { CircleArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const LoginCard = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-[calc(100%-7rem)] h-[calc(100%-2rem)] m-5 rounded-2xl overflow-hidden">
      <motion.button
        className="absolute top-10 right-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-200 px-4 py-2 group"
        onClick={() => navigate("/")}
        whileHover="hover"
      >
        Back to Website
        <motion.span
          className="inline-flex items-center overflow-hidden"
          variants={{
            hover: {
              width: "auto",
              opacity: 1,
              x: 0,
              marginLeft: "0.5rem",
            },
          }}
          initial={{ width: 0, opacity: 0, x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <CircleArrowRight />
        </motion.span>
      </motion.button>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${gradient_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#fef3c7", // Fallback color that matches your amber-50
        }}
      >
        <img src={logo} alt="" className="w-40 h-40 m-l-" />
      </div>
    </div>
  );
};

export default LoginCard;
