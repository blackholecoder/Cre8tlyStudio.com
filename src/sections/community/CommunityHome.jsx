import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
// import { Users, MessageSquare, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  <div className="min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-8">Cre8tly Community</h1>

    <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">
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
);

}
