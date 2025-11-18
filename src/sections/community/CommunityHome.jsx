import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
// import { Users, MessageSquare, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "../../components/animation/AnimatedLogo";

export default function CommunityHome() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get("/community/topics");
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    };

    fetchTopics();
  }, []);

return (
  <div className="w-full flex justify-center items-start min-h-screen px-6 py-20">
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-10 backdrop-blur-sm shadow-xl space-y-10">
    
    {/* Logo */}
    <div className="flex items-center justify-center text-center mb-6">
      <AnimatedLogo />
    </div>

    {/* Page Title */}
    <h1 className="text-3xl font-bold mb-4">Cre8tly Community 💬</h1>

    {/* Scrollable Topics */}
    <div className="max-w-5xl w-full overflow-y-auto max-h-[70vh] pr-2">
      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/community/topic/${t.id}`)}
            className="bg-gray-900/80 p-6 rounded-xl border border-gray-700 hover:border-green 
                       hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all text-left"
          >
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            <p className="text-gray-400 text-sm">{t.description}</p>
          </button>
        ))}
      </div>
    </div>

  </div>
  </div>
);


}
