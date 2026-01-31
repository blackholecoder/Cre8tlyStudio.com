import { useEffect, useState } from "react";
import { MentionCard } from "../MentionCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";

export function Mention({ username }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hoverTrigger, setHoverTrigger] = useState(false);
  const [hoverCard, setHoverCard] = useState(false);

  const navigate = useNavigate();

  const fetchPreview = async () => {
    if (user || loading) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/community/users/preview/${username}`,
      );
      setUser(res.data.user);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (!user?.author_has_profile) return;

    navigate(`/community/authors/${user.id}`);
  };

  useEffect(() => {
    if (!hoverTrigger && !hoverCard) {
      setOpen(false);
    }
  }, [hoverTrigger, hoverCard]);

  return (
    <span className="relative inline-block">
      <span
        onClick={handleClick}
        onMouseEnter={() => {
          setHoverTrigger(true);
          setOpen(true);
          fetchPreview();
        }}
        onMouseLeave={() => {
          setHoverTrigger(false);
        }}
        className={`
        text-sky-400 font-medium
        ${
          user && !user.author_has_profile
            ? "cursor-default opacity-60"
            : "cursor-pointer hover:underline"
        }
      `}
      >
        @{username}
      </span>

      <MentionCard
        user={user}
        open={open}
        onEnter={() => setHoverCard(true)}
        onLeave={() => setHoverCard(false)}
      />
    </span>
  );
}
