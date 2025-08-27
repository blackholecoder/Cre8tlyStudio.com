import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
import { useInView } from "react-intersection-observer";
import VideoItem from "../components/VideoItem";
import Nav from "../components/Nav";
import axiosInstance from "../api/axios";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView(); // Detect when user reaches the bottom

  // ✅ Fetch videos function (No unnecessary dependencies)
  const fetchVideos = useCallback(async () => {
    if (!hasMore || loading) return; // ✅ Prevent multiple API calls

    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/videos/videoList", {
        params: { page, pageSize: 10 },
      });
      
      const newVideos = response.data.data || []; // ✅ Ensure correct structure
      console.log(" newVideos",  newVideos)
      if (newVideos.length === 0) {
        setHasMore(false); // ✅ Stop fetching when no more videos exist
      } else {
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, page]); // ✅ Removed `loading` from dependencies

  // ✅ Trigger fetch when inView is true
  useEffect(() => {
    if (inView && !loading) {
      fetchVideos();
    }
  }, [inView, fetchVideos]); // ✅ Only depend on `inView` and `fetchVideos`
  
  
  return (
    <div className="flex flex-col items-center p-4 mt-20 min-h-screen bg-black text-white">
       <Nav />

      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-md space-y-6">
        {videos.map((video, index) => (
          <VideoItem key={index} video={video} />
        ))}
      </div>
      <div ref={ref} className="w-full flex justify-center my-4">
        {loading && <p>Loading more videos...</p>}
        {!hasMore && <p>No more videos to load.</p>}
      </div>
    </div>
  );
};




export default Videos;
