import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VideoCard from "../project_components/VideoCard.jsx";
function Home() {
  const navigate = useNavigate();
  const videos = [
    {
      id: 1,
      title: "React tutorials for Beginners",
      channel: "TechHub",
      views: "1M",
      uploaded: "2 days ago",
      duration: "2:30:00",
    },
    {
      id: 2,
      title: "Mastering JavaScript in 2025",
      channel: "CodeVerse",
      views: "850K",
      uploaded: "1 week ago",
      duration: "45:12",
    },
    {
      id: 3,
      title: "Python Flask Crash Course",
      channel: "DevSimplified",
      views: "640K",
      uploaded: "3 days ago",
      duration: "1:20:22",
    },
    {
      id: 4,
      title: "Complete MERN Stack Project Tutorial",
      channel: "BuildWithSam",
      views: "1.4M",
      uploaded: "2 months ago",
      duration: "3:10:55",
    },
    {
      id: 5,
      title: "Tailwind CSS in 30 Minutes",
      channel: "FrontendFuel",
      views: "420K",
      uploaded: "5 hours ago",
      duration: "29:40",
    },
    {
      id: 6,
      title: "Understanding React Context API",
      channel: "Reactify",
      views: "300K",
      uploaded: "2 weeks ago",
      duration: "18:10",
    },
    {
      id: 7,
      title: "Docker for Absolute Beginners",
      channel: "CloudMasters",
      views: "970K",
      uploaded: "4 days ago",
      duration: "55:05",
    },
    {
      id: 8,
      title: "Node.js Authentication System",
      channel: "Backend Bites",
      views: "780K",
      uploaded: "3 weeks ago",
      duration: "1:05:12",
    },
    {
      id: 9,
      title: "CSS Grid Full Course",
      channel: "DesignFlow",
      views: "260K",
      uploaded: "6 days ago",
      duration: "35:50",
    },
    {
      id: 10,
      title: "AI Image Generation Tutorial",
      channel: "FutureTech",
      views: "1.1M",
      uploaded: "1 month ago",
      duration: "48:55",
    },
    {
      id: 11,
      title: "Java Full Course 2025",
      channel: "Tech Academy",
      views: "2.2M",
      uploaded: "2 months ago",
      duration: "4:12:32",
    },
    {
      id: 12,
      title: "How to Build APIs with FastAPI",
      channel: "PythonX",
      views: "540K",
      uploaded: "10 days ago",
      duration: "39:44",
    },
    {
      id: 13,
      title: "Next.js Dynamic Routing Explained",
      channel: "NextLevel Dev",
      views: "390K",
      uploaded: "3 weeks ago",
      duration: "33:18",
    },
    {
      id: 14,
      title: "SQL in One Hour — Beginner Friendly",
      channel: "DataPro",
      views: "600K",
      uploaded: "2 days ago",
      duration: "1:00:00",
    },
    {
      id: 15,
      title: "Building Portfolio with React",
      channel: "CreativeDev",
      views: "150K",
      uploaded: "12 hours ago",
      duration: "22:05",
    },
    {
      id: 16,
      title: "Understanding Microservices Architecture",
      channel: "SystemDesignHub",
      views: "980K",
      uploaded: "3 months ago",
      duration: "58:12",
    },
  ];

  return (
    <>
      <div className="p-4 grid lg:grid-cols-3 gap-2 no-scrollbar">
        {videos.map((video) => {
          return <VideoCard key={video.id} {...video} />;
        })}
      </div>
    </>
  );
}

export default Home;
