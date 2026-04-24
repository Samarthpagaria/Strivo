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

const FeatureCard = ({ title, desc, col, index, showAllCorners }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
    className={`${col} group relative border-r border-b border-dashed border-neutral-400/60 p-8 md:p-12 hover:bg-white transition-all duration-500 cursor-pointer`}
  >
    {/* Dynamic Crosshair Markers */}
    {[
      "absolute -right-[6.5px] -bottom-[6.5px]", // Bottom-Right (Default)
      ...(showAllCorners
        ? [
            "absolute -left-[6.5px] -top-[6.5px]", // Top-Left
            "absolute -right-[6.5px] -top-[6.5px]", // Top-Right
            "absolute -left-[6.5px] -bottom-[6.5px]", // Bottom-Left
          ]
        : []),
    ].map((pos, i) => (
      <div
        key={i}
        className={`${pos} w-3 h-3 flex items-center justify-center z-10 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`}
      >
        <div className="absolute w-full h-[1px] bg-neutral-500" />
        <div className="absolute h-full w-[1px] bg-neutral-500" />
      </div>
    ))}

    <div className="flex flex-col gap-4 relative">
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight font-satoshi group-hover:text-[#ff9d6c] transition-colors duration-500">
        {title}
      </h3>
      <p className="text-neutral-500 font-medium leading-relaxed font-inter text-sm md:text-base max-w-md transition-colors duration-500 group-hover:text-neutral-700">
        {desc}
      </p>
    </div>
  </motion.div>
);

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
              className="group/btn px-3 py-1.5 text-lg font-bold text-neutral-500 hover:text-neutral-900 transition-colors font-satoshi border-r border-neutral-200 hover:bg-neutral-100 active:bg-neutral-200 rounded-l-full flex items-center gap-1.5 pl-3"
            >
              <ArrowUp
                size={22}
                className="group-hover/btn:-translate-y-1 transition-transform duration-300"
              />
              Upvote
            </button>
            <div className="px-3 py-1.5 min-w-[3.5rem] text-center flex items-center justify-center bg-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={upvotes}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-lg font-bold text-neutral-900 font-satoshi tabular-nums block"
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
        <section className="w-full max-w-7xl px-6 py-40 flex flex-col items-center gap-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <h2 className="text-4xl md:text-6xl font-medium text-neutral-900 tracking-tighter font-satoshi">
              Features
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl text-center leading-relaxed  font-inter">
              Upload videos, tweet instantly from content, manage playlists, and
              stay connected with your audience through one seamless experience.
            </p>
          </motion.div>

          {/* Crosshair Grid Features */}
          <div className="w-full relative px-4 md:px-0 max-w-[90rem]">
            {/* Perimeter Masking (Reduced Size) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Left Column Buffer Mask */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-neutral-50 to-transparent" />
              {/* Right Column Buffer Mask */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-neutral-50 to-transparent" />
              {/* Top Row Buffer Mask */}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-neutral-50 to-transparent" />
              {/* Bottom Row Buffer Mask */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-t border-dashed border-neutral-400/60 relative">
              {/* Extra Top Row with Side Buffers */}
              <div className="hidden md:block col-span-1 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-7 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-3 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-1 h-16 border-r border-b border-dashed border-neutral-400/30" />

              {/* Row 1 Content with Buffer Columns */}
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />
              <FeatureCard
                title="One-Click Social Clipping"
                desc="Turn any video into a community post instantly. Share videos directly to your feed with rich media mentions."
                col="md:col-span-7"
                index={0}
                showAllCorners={true}
              />
              <FeatureCard
                title="Threaded Conversations"
                desc="Follow deep discussions with structured multi-level replies. Organized and easy to navigate."
                col="md:col-span-3"
                index={1}
                showAllCorners={true}
              />
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />

              {/* Row 2 Content with Buffer Columns */}
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />
              <FeatureCard
                title="Unified Video + Social"
                desc="Watch videos, join discussions and discover new content all without leaving the player."
                col="md:col-span-3"
                index={2}
                showAllCorners={true}
              />
              <FeatureCard
                title="Smart Playlists & Curation"
                desc="Create and manage personalized playlists with quick actions. Build your own viewing protocols."
                col="md:col-span-7"
                index={3}
                showAllCorners={true}
              />
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />

              {/* Row 3 Content with Buffer Columns */}
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />
              <FeatureCard
                title="Creator Publishing Studio"
                desc="Upload videos with live previews, metadata control, and smooth publishing workflows."
                col="md:col-span-5"
                index={4}
                showAllCorners={true}
              />
              <FeatureCard
                title="Intelligent Channel Profiles"
                desc="Every creator gets a digital identity with videos, playlists, and posts in one space."
                col="md:col-span-5"
                index={5}
                showAllCorners={true}
              />
              <div className="hidden md:block col-span-1 border-r border-b border-dashed border-neutral-400/30 h-full" />

              {/* Extra Bottom Row with Side Buffers */}
              <div className="hidden md:block col-span-1 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-5 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-5 h-16 border-r border-b border-dashed border-neutral-400/30" />
              <div className="hidden md:block col-span-1 h-16 border-r border-b border-dashed border-neutral-400/30" />
            </div>
          </div>
        </section>
        {/* How it Works Section */}
        <section className="w-full max-w-7xl px-6 py-40 flex flex-col items-center gap-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <h2 className="text-4xl md:text-7xl font-medium text-neutral-900 tracking-tighter font-satoshi">
              How it Works
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl text-center leading-relaxed font-inter">
              Master the Strivo ecosystem in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full relative">
            {/* Horizontal Connector Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-[1px] bg-neutral-200/60 z-0" />

            {[
              {
                step: "01",
                title: "Register & Sync",
                desc: "Establish your digital identity and prepare your broadcast protocols. One account for everything.",
              },
              {
                step: "02",
                title: "Broadcast Vision",
                desc: "Upload high-fidelity videos and engage in deep threaded community discussions instantly.",
              },
              {
                step: "03",
                title: "Scale Audience",
                desc: "Use one-click social clipping to cross-post and grow your unified community effortlessly.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex flex-col items-start gap-8 relative z-10 group"
              >
                {/* Step Number Circle */}
                <div className="w-24 h-24 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-3xl font-black font-satoshi text-neutral-900 shadow-sm group-hover:bg-white group-hover:border-blue-600 group-hover:text-blue-600 transition-all duration-500">
                  {item.step}
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight font-satoshi">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 font-medium leading-relaxed font-inter text-base max-w-xs">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
