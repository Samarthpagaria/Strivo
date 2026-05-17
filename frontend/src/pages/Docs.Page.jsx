import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import flowImg from "../assets/flow.png";
import dbDiagramSvg from "../assets/dbDark.svg?raw";

function Docs() {
  const context = useOutletContext();
  const scrollRef = context?.scrollRef;
  const [activeSection, setActiveSection] = useState("overview");
  const [hoveredTable, setHoveredTable] = useState(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const sections = [
    {
      id: "overview",
      label: "1. Project Overview",
      ticks: ["Purpose", "Core Functions", "Value Prop"]
    },
    {
      id: "tech-stack",
      label: "2. Tech Stack",
      ticks: ["Frontend", "Backend", "Database"]
    },
    {
      id: "architecture",
      label: "3. How It’s Made",
      ticks: ["Flow Diagram", "Cold-Start", "Media Pipeline"]
    },
    {
      id: "database",
      label: "4. Database Structure",
      ticks: ["Collections", "Model Attributes"]
    },
    {
      id: "frontend",
      label: "5. Frontend Details",
      ticks: ["Client Layout", "Context Managers"]
    },
    {
      id: "routes",
      label: "6. Backend API Routes",
      ticks: ["Auth", "Videos", "MicroPosts", "Comments", "Likes", "Playlists"]
    },
    {
      id: "backend",
      label: "7. Backend Details",
      ticks: ["API Controllers", "Global Middleware"]
    },
    {
      id: "deployment",
      label: "8. Deployment Specifics",
      ticks: ["Vercel Host", "Render Server"]
    }
  ];

  const dbTables = [
    {
      name: "Users",
      fields: [
        "username (Unique, Indexed, Lowcase)",
        "email (Unique, Lowcase)",
        "fullName (Trimmed)",
        "avatar (CDN URL)",
        "coverImage (CDN URL)",
        "watchHistory [Array of Ref Video]",
      ],
      description: "Manages identity data, profile custom assets, and personalized session references."
    },
    {
      name: "Videos",
      fields: [
        "videoFile (CDN Storage URL)",
        "thumbnail (CDN Storage URL)",
        "title (Required)",
        "description",
        "duration (Number)",
        "views (Number, Default: 0)",
        "isPublished (Boolean)",
        "owner [Ref User]",
      ],
      description: "Maintains records of hosted media uploads, stream parameters, and metadata."
    },
    {
      name: "MicroPosts",
      fields: [
        "owner [Ref User]",
        "content (Required, Max 280 chars)",
        "parentPostId [Ref MicroPost, Optional]",
        "videoMention [Ref Video, Optional]",
      ],
      description: "Handles short-form user posts, community thread chains, and video contextual mentions."
    },
    {
      name: "Likes",
      fields: [
        "likedBy [Ref User]",
        "video [Ref Video, Mutually Exclusive]",
        "comment [Ref Comment, Mutually Exclusive]",
        "post [Ref MicroPost, Mutually Exclusive]",
      ],
      description: "Tracks active upvotes and reactions across media, comment threads, and posts."
    },
    {
      name: "Comments",
      fields: [
        "content (Required)",
        "video [Ref Video]",
        "owner [Ref User]",
      ],
      description: "Stores textual comment streams attached to active video files."
    },
    {
      name: "Subscriptions",
      fields: [
        "subscriber [Ref User]",
        "channel [Ref User]",
      ],
      description: "Interlinks channels and user subscribers for direct home discoveries."
    },
    {
      name: "Playlists",
      fields: [
        "name (Required)",
        "description",
        "videos [Array of Ref Video]",
        "owner [Ref User]",
      ],
      description: "Custom user watchlists mapping ordered media groups."
    },
    {
      name: "SiteStats",
      fields: [
        "totalViews (Number)",
        "totalUsers (Number)",
        "totalVideos (Number)",
      ],
      description: "Compiles system data aggregations for dashboard feeds."
    }
  ];

  const apiRoutes = [
    {
      prefix: "/api/v1/users",
      title: "Authentication & Users",
      endpoints: [
        { method: "POST", path: "/register", desc: "Register a new user identity" },
        { method: "POST", path: "/login", desc: "Authorize user and return dual tokens" },
        { method: "POST", path: "/logout", desc: "End session and clear client cookies" },
        { method: "POST", path: "/refresh-token", desc: "Request new access session token" },
        { method: "POST", path: "/change-password", desc: "Update user password credentials" },
        { method: "GET", path: "/current-user", desc: "Retrieve active user state" },
        { method: "PATCH", path: "/update-account", desc: "Update account details" },
        { method: "PATCH", path: "/avatar", desc: "Upload and update user profile avatar" },
        { method: "PATCH", path: "/cover-image", desc: "Upload and update cover banner" },
        { method: "GET", path: "/c/:username", desc: "Retrieve channel profile information" },
        { method: "GET", path: "/history", desc: "Fetch authenticated watch history feed" }
      ]
    },
    {
      prefix: "/api/v1/videos",
      title: "Video streams",
      endpoints: [
        { method: "GET", path: "/", desc: "Search and paginated discover videos" },
        { method: "POST", path: "/", desc: "Upload video and generate thumbnail" },
        { method: "GET", path: "/:videoId", desc: "Retrieve specific video metadata" },
        { method: "DELETE", path: "/:videoId", desc: "Remove video asset from database" },
        { method: "PATCH", path: "/:videoId", desc: "Update video metadata or edit thumbnail" },
        { method: "PATCH", path: "/toggle/publish/:videoId", desc: "Toggle active visibility status" }
      ]
    },
    {
      prefix: "/api/v1/posts",
      title: "Micro-Posts",
      endpoints: [
        { method: "POST", path: "/", desc: "Publish a short-form text post" },
        { method: "GET", path: "/user/:userId", desc: "Retrieve all posts from a specific channel" },
        { method: "PATCH", path: "/:postId", desc: "Modify active text post" },
        { method: "DELETE", path: "/:postId", desc: "Remove post from feed structures" }
      ]
    },
    {
      prefix: "/api/v1/comments",
      title: "Comments",
      endpoints: [
        { method: "GET", path: "/video/:videoId", desc: "Fetch comments catalog for a video" },
        { method: "POST", path: "/video/:videoId", desc: "Post new comment string" },
        { method: "DELETE", path: "/c/:commentId", desc: "Delete active comment item" },
        { method: "PATCH", path: "/c/:commentId", desc: "Modify published comment content" }
      ]
    },
    {
      prefix: "/api/v1/likes",
      title: "Likes & Reactions",
      endpoints: [
        { method: "POST", path: "/toggle/v/:videoId", desc: "Toggle upvote state on a video" },
        { method: "POST", path: "/toggle/p/:postId", desc: "Toggle upvote state on a post" },
        { method: "POST", path: "/toggle/c/:commentId", desc: "Toggle upvote state on a comment" },
        { method: "GET", path: "/videos", desc: "Fetch catalog of upvoted streams" }
      ]
    },
    {
      prefix: "/api/v1/subscriptions",
      title: "Subscriptions",
      endpoints: [
        { method: "POST", path: "/c/:channelId", desc: "Toggle active channel subscription state" },
        { method: "GET", path: "/c/:channelId", desc: "Fetch channel subscriber statistics" },
        { method: "GET", path: "/u/:subscriberId", desc: "Fetch channels followed by user ID" }
      ]
    },
    {
      prefix: "/api/v1/playlists",
      title: "Playlists",
      endpoints: [
        { method: "POST", path: "/", desc: "Instantiate a new watch playlist" },
        { method: "GET", path: "/:playlistId", desc: "Retrieve active playlist stream items" },
        { method: "PATCH", path: "/:playlistId", desc: "Update playlist custom meta details" },
        { method: "DELETE", path: "/:playlistId", desc: "Delete watch playlist" },
        { method: "POST", path: "/add/:videoId/:playlistId", desc: "Append video item to playlist" },
        { method: "POST", path: "/remove/:videoId/:playlistId", desc: "Remove video item from playlist" },
        { method: "GET", path: "/user/:userId", desc: "Retrieve playlists for a user ID" }
      ]
    },
    {
      prefix: "/api/v1/dashboard",
      title: "System Stats",
      endpoints: [
        { method: "GET", path: "/api/v1/healthcheck", desc: "Wake/Ping node server instance" },
        { method: "GET", path: "/api/v1/dashboard/stats", desc: "Fetch aggregate channel stats" }
      ]
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef?.current || window;

    const handleScroll = () => {
      const scrollTop = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
      const scrollHeight = scrollContainer === window ? document.documentElement.scrollHeight : scrollContainer.scrollHeight;
      const clientHeight = scrollContainer === window ? window.innerHeight : scrollContainer.clientHeight;
      


      const scrollPosition = scrollTop + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-satoshi selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Centered Main Column with thin Left and Right Borders */}
      <div className="max-w-4xl mx-auto border-l border-r border-neutral-200 dark:border-neutral-800 min-h-screen flex flex-col bg-white dark:bg-black w-full relative">

        {/* Content Area */}
        <main className="flex-1 px-8 lg:px-16 py-12 lg:py-20 space-y-24">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="border-b border-neutral-100 dark:border-neutral-900 pb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono mb-4 text-neutral-500 dark:text-neutral-400">
              <span>v1.0.0</span>
              <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
              <span>Technical Specs</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white mb-4">
              Strivo
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              Full technical and architectural documentation of the Strivo video-sharing and micro-blogging ecosystem.
            </p>
          </motion.header>

          {/* 1. Project Overview */}
          <motion.section id="overview" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              1. Project Overview
            </h2>
            <div className="space-y-6">
              <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                Strivo is a full-stack video-centric social platform designed to unify rich media content and real-time user interaction within a single, seamless interface. It enables users to upload, explore, and engage with video content while simultaneously participating in short-form updates and discussions through an integrated side feed.
              </p>
              
              <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                The platform focuses on delivering a smooth and immersive user experience by combining long-form content consumption with quick, dynamic interactions—all without requiring users to switch between different applications or interfaces.
              </p>

              {/* Purpose */}
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-2 flex items-center gap-2">
                  <span>🎯</span> Purpose
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                  Strivo aims to simplify the way users interact with digital content by bringing together media viewing and social engagement into one cohesive environment. It is built to support both content creators and viewers by offering tools for content management, discovery, and communication.
                </p>
              </div>

              {/* Core Functionalities & Target Users */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Core Functionalities */}
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                    <span>⚙️</span> Core Functionalities
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Video upload and playback system
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      User interactions including likes, comments, and playlists
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Personalized watch history tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Integrated micro-post feed for real-time updates and discussions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Interactive and resizable layout for multitasking
                    </li>
                  </ul>
                </div>

                {/* Target Users */}
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                    <span>👥</span> Target Users
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Content creators looking to manage and share video content efficiently
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Users who prefer a unified platform for both content consumption and interaction
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Communities that rely on quick updates alongside detailed media content
                    </li>
                  </ul>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-2 flex items-center gap-2">
                  <span>🚀</span> Value Proposition
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                  Strivo eliminates the need to juggle multiple platforms by combining content consumption and communication into a single-page experience. This results in better user engagement, improved accessibility, and a more connected digital ecosystem.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 2. Tech Stack */}
          <motion.section id="tech-stack" className="scroll-mt-24 space-y-8" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              2. Tech Stack
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Frontend Architecture */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <span>💻</span> Frontend Architecture
                </h3>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-950 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Framework</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">React</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Build Tool</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Vite</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Styling</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Tailwind CSS (via @tailwindcss/vite)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">State Management</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">React Context API (Domain-specific Contexts)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Data Fetching & Fetch Client</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">TanStack React Query + Axios</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Routing</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">React Router DOM (createBrowserRouter)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Animation & Scroll</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Framer Motion + GSAP + Lenis</p>
                  </div>
                </div>
              </div>

              {/* Backend Architecture */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <span>🔌</span> Backend Architecture
                </h3>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-950 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Runtime</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Node.js (ES Modules - type: module)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Web Framework</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Express</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Token Authentication</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">JSON Web Tokens (JWT) dual token strategy</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Password Security & Cryptography</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Bcrypt hashing algorithm (12 salt rounds)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Cross-Origin Security</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">CORS (Cors Middleware with origin-matching lists)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Cookie Handler</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Cookie-Parser for httpOnly cookie security</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Staged Media Uploads</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Multer (disk storage routing to local temp directories)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Cloud Media CDN & Transporter</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Cloudinary SDK (large file upload handlers with dynamic file unlinking)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Environment Configuration</span>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Dotenv configurations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Database & Infrastructure */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                <span>🗄️</span> Database & Infrastructure
              </h3>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-950 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Database</span>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">MongoDB Atlas (strivoDB)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">ODM / Query Builder</span>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Mongoose</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Pagination Support</span>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">mongoose-aggregate-paginate-v2</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Frontend Host</span>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Vercel</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold">Backend Host</span>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">Render</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 3. How It’s Made */}
          <motion.section id="architecture" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              3. How It’s Made (Architecture & Workflows)
            </h2>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black dark:text-white">High-Level Flow Diagram</h3>
              <div className="p-5 bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                <img
                  src={flowImg}
                  alt="High-Level Flow Diagram"
                  className="max-w-full h-auto rounded-lg select-none pointer-events-none hover:scale-[1.015] transition-transform duration-500 ease-out"
                  draggable="false"
                />
              </div>
            </div>

            <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="space-y-2">
                <h4 className="font-bold text-black dark:text-white">Cold-Start Mitigation</h4>
                <p>
                  To combat Render’s free-tier container sleep cycle, the frontend landing page fires a <code>GET /api/v1/healthcheck</code> warm-up ping immediately on mounting, ensuring a fast sign-in response for incoming users.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black dark:text-white">Media Upload Pipeline</h4>
                <p>
                  Video uploads use a Multer-to-Cloudinary staging model. Client files hit <code>POST /api/v1/videos</code>, get stored temporarily under <code>./public/temp/</code>, and are immediately pushed to Cloudinary via <code>cloudinary.uploader.upload_large</code>. The temp local files are cleared synchronously immediately after, ensuring zero server storage bloat.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black dark:text-white">Discover Feed</h4>
                <p>
                  To keep the video and micro-post feeds engaging and stable, the backend implements a randomized discovery model utilizing the Fisher-Yates shuffle algorithm on compiled subscriptions and public videos.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 4. Database Structure */}
          <motion.section id="database" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              4. Database Structure
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Hover over each collection card to reveal the structured properties (all password references and sensitive data keys are strictly hidden for complete privacy).
            </p>

            {/* Database Schema Vector Diagram */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl flex items-start justify-start overflow-hidden shadow-sm hover:shadow-md transition duration-300 w-full">
              <div 
                data-lenis-prevent="true"
                className="w-full max-h-[600px] overflow-auto no-scrollbar flex items-start justify-start [&>svg]:min-w-[1200px] [&>svg]:h-auto select-none [&>svg]:pointer-events-none hover:scale-[1.005] transition-transform duration-500 ease-out"
                dangerouslySetInnerHTML={{ __html: dbDiagramSvg }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {dbTables.map((table, idx) => (
                <motion.div
                  key={table.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredTable(table.name)}
                  onMouseLeave={() => setHoveredTable(null)}
                  className="group relative border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl bg-white dark:bg-black hover:border-black dark:hover:border-white transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[120px]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-lg text-black dark:text-white tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        {table.name}
                      </h4>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                        {hoveredTable === table.name ? "Expanded" : "Hover to view"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
                      {table.description}
                    </p>

                    <div
                      className={`mt-4 space-y-2 border-t border-neutral-100 dark:border-neutral-900 pt-4 overflow-hidden transition-all duration-500 ease-in-out ${
                        hoveredTable === table.name ? "max-h-[300px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 block mb-1">
                        Properties
                      </span>
                      <ul className="text-xs text-neutral-600 dark:text-neutral-300 font-mono space-y-1.5">
                        {table.fields.map((field) => (
                          <li key={field} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 5. Frontend Details */}
          <motion.section id="frontend" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              5. Frontend Details
            </h2>
            <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                The client interface is architected as a high-performance React Single Page Application (SPA). To comply with rigorous data governance and protect internal architecture details, specific folder maps and individual context properties are strictly abstracted.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                Views and layouts are dynamically mounted at runtime. Application states are managed through specialized, domain-separated Context Providers, optimizing feed performance, session state synchronization, and reactive UI configurations.
              </p>
            </div>
          </motion.section>

          {/* 6. Backend API Routes */}
          <motion.section id="routes" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              6. Backend API Routes
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Below is the comprehensive catalog of secure backend routing endpoints under <code>/api/v1/</code>:
            </p>

            <div className="space-y-8">
              {apiRoutes.map((group, idx) => (
                <motion.div
                  key={group.prefix}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-900 pb-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                      {group.title}
                    </h3>
                    <code className="text-[10px] font-mono text-neutral-400 bg-neutral-50 dark:bg-neutral-950 px-2 py-0.5 border border-neutral-100 dark:border-neutral-900 rounded">
                      {group.prefix}
                    </code>
                  </div>
                  
                  <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                          <th className="p-3 font-bold text-neutral-500 w-24">Method</th>
                          <th className="p-3 font-bold text-neutral-500 w-48">Endpoint Path</th>
                          <th className="p-3 font-bold text-neutral-500">Operation Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                        {group.endpoints.map((route) => (
                          <tr key={route.path} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition">
                            <td className="p-3">
                              <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                                {route.method}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-neutral-800 dark:text-neutral-200 font-semibold">
                              {route.path}
                            </td>
                            <td className="p-3 text-neutral-500 dark:text-neutral-400">
                              {route.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 7. Backend Details */}
          <motion.section id="backend" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              7. Backend Details
            </h2>

            <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                The server runtime operates under a clean, versioned REST API pattern, built upon modular controller-route architectures. Staged media and credentials validations execute securely across modularized middleware.
              </p>
              <div className="space-y-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="font-bold text-xs text-black dark:text-white uppercase tracking-wider">Global Middleware Pipeline</h4>
                <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-2 list-disc pl-5">
                  <li><strong>Cors Filter:</strong> Handles request filtering against configured domain endpoints.</li>
                  <li><strong>Decryption Parser:</strong> decodes custom incoming HTTP cookies securely.</li>
                  <li><strong>Bearer Authenticator:</strong> Decodes and validates JWT signatures, binding identity models directly to active requests.</li>
                  <li><strong>Global JSON Logger & Wrapper:</strong> Format errors and response entities into standardized, clean schemas.</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 8. Deployment Specifics */}
          <motion.section id="deployment" className="scroll-mt-24 space-y-6" {...fadeInUp}>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-2">
              8. Deployment Specifics
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl">
                <h4 className="font-bold text-sm text-black dark:text-white mb-2">Vercel (Frontend)</h4>
                <ul className="text-xs text-neutral-500 space-y-2">
                  <li><strong>Project:</strong> strivo-app</li>
                  <li><strong>Framework Preset:</strong> Vite</li>
                  <li><strong>Build Command:</strong> <code>npm run build</code></li>
                  <li><strong>Output Dir:</strong> <code>dist/</code></li>
                  <li><strong>Env Variable:</strong> <code>VITE_API_URL</code> pointing to Render backend.</li>
                </ul>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl">
                <h4 className="font-bold text-sm text-black dark:text-white mb-2">Render (Backend)</h4>
                <ul className="text-xs text-neutral-500 space-y-2">
                  <li><strong>Service Type:</strong> Web Service (Node.js)</li>
                  <li><strong>Start Command:</strong> <code>node src/index.js</code></li>
                  <li><strong>Auto Deploy:</strong> Enabled via GitHub main branch sync.</li>
                  <li><strong>Port:</strong> 10000</li>
                  <li><strong>Health Check Endpoint:</strong> <code>/api/v1/healthcheck</code></li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-neutral-100 dark:border-neutral-900 pt-8 text-xs text-neutral-400 dark:text-neutral-500 text-center"
          >
            Strivo Ecosystem Documentation &copy; {new Date().getFullYear()}. Minimalist theme configured.
          </motion.footer>

        </main>
      </div>
    </div>
  );
}

export default Docs;
