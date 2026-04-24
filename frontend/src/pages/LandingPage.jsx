import React from "react";
import { useNavigate } from "react-router-dom";
import { Github, ArrowUp, ArrowRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import logo from "../assets/strivo_black_logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = React.useRef(null);

  const [upvotes, setUpvotes] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.4], [150, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const headlines = [
    "Your Audience Shouldn’t Live on Different Platforms",
    "Stop Posting Everywhere. Start Growing Here.",
  ];
  const [headlineIndex, setHeadlineIndex] = React.useState(0);

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-neutral-50 relative flex flex-col items-center antialiased selection:bg-indigo-100 ">
      {/* Autonomous Navigation Nodes */}
      {/* node 1: Scaled Identity */}
      <motion.div
        onClick={() => navigate("/")}
        initial={false}
        animate={{
          left: "50%",
          x: scrolled ? "calc(-50vw + 12px)" : "-130%",
          top: "12px",
          scale: scrolled ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed z-50 flex items-center justify-center cursor-pointer group -mt-[4px] whitespace-nowrap"
      >
        <img src={logo} alt="Strivo" className="w-20 h-20 object-contain" />
        <span className="text-neutral-900 font-bold font-satoshi text-5xl tracking-tight pb-2 ">
          Strivo
        </span>
      </motion.div>

      {/* node 2: Actions */}
      <motion.nav
        initial={false}
        animate={{
          left: "50%",
          x: scrolled ? "calc(50vw - 32px - 100%)" : "-10%",
          top: "16px",
          scale: scrolled ? 0.95 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed z-50 flex items-center gap-4 px-1 py-1 bg-white border border-neutral-200 rounded-full shadow-sm min-w-max"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden border border-neutral-200 rounded-full bg-neutral-50/50 hover:border-neutral-300 transition-all group/upvote shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
            <button
              onClick={() => setUpvotes((prev) => prev + 1)}
              className="group/btn px-2 py-1 text-medium font-bold text-neutral-500 hover:text-neutral-900 transition-colors font-satoshi border-r border-neutral-200 hover:bg-neutral-100 active:bg-neutral-200 flex items-center gap-1"
            >
              <ArrowUp
                size={20}
                className="group-hover/btn:-translate-y-1 transition-transform duration-300"
              />
              Upvote
            </button>
            <div className="px-1 py-1.5 min-w-[3rem] text-center flex items-center justify-center bg-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={upvotes}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-medium font-bold text-neutral-900 font-satoshi tabular-nums block"
                >
                  {upvotes}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <a
            href="#"
            className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
          >
            <Github size={24} />
          </a>
        </div>

        <div className="h-6 w-px bg-neutral-300" />

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-lg font-bold  text-neutral-500 hover:text-neutral-900 font-satoshi px-1 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="group/signup bg-[#fe4524c2] border  text-[#f2f3f4] text-lg font-bold px-3 py-1.5 rounded-full hover:bg-[#fe4524] transition-all active:scale-95 shadow-lg shadow-blue-500/10 flex items-center gap-2"
          >
            Sign up
            <ArrowRight
              size={20}
              className="group-hover/signup:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-[20vh] text-center px-6">
        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeIn" }}
              className=" text-5xl md:text-5xl lg:text-[4rem] font-bold text-neutral-900 tracking-tight leading-[1.05] font-satoshi max-w-5xl flex flex-wrap justify-center"
            >
              {headlines[headlineIndex].split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="inline-block mr-[0.25em] last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-lg md:text-3xl text-neutral-500 font-medium tracking-tight font-inter max-w-2xl leading-snug mt-4"
          >
            Turn content into conversations,
            <br /> and followers into a strong community.
          </motion.p>
        </div>

        {/* Video Section */}
        <div
          style={{ perspective: "1200px" }}
          className="w-full flex justify-center"
        >
          <motion.section
            ref={containerRef}
            style={{
              rotateX: rotate,
              scale: scale,
              y: translate,
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-6xl px-6 mt-20 relative group"
          >
            <div className="relative rounded-[2.5rem] border border-neutral-200 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] bg-white/50 backdrop-blur-sm overflow-hidden">
              {/* Slant Gray Lines Pattern */}
              <div
                className="absolute inset-0 opacity-[0.4] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #6b7280, #6b7280 1px, transparent 1px, transparent 5px)`,
                }}
              />
              <div className="rounded-[2rem] overflow-hidden aspect-video bg-neutral-900 flex items-center justify-center relative border border-neutral-200/50 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                <div className="relative flex flex-col items-center gap-4 text-neutral-400">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                  <span className="font-medium tracking-wide text-sm uppercase">
                    Project Preview
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Features Section */}
        <section className="w-full max-w-6xl px-6 py-40 flex flex-col items-center gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <h2 className="text-4xl md:text-6xl font-medium text-neutral-900 tracking-tighter font-satoshi">
              Features
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl text-center leading-relaxed">
              Upload videos, tweet instantly from content, manage playlists, and
              stay connected with your audience through one seamless experience.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
