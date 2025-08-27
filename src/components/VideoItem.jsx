import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactPlayer from "react-player";
import axiosInstance from "../api/axios";
import { useInView } from "react-intersection-observer";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineShareAlt, AiOutlineEllipsis } from "react-icons/ai";
import { TiStarFullOutline } from "react-icons/ti";
import { BsChatDots } from "react-icons/bs";
import { Modal, Box, Typography } from "@mui/material";
import colors from "../config/colors";
import CommentItem from "./CommentItem";
import { userImage } from "../assets/images";

// Helper function to convert a flat comments list into a nested structure
const nestComments = (comments) => {
  const commentMap = {};
  // Initialize a map of comments with an empty replies array for each
  comments.forEach((comment) => {
    commentMap[comment._id] = { ...comment, replies: [] };
  });

  const nested = [];
  comments.forEach((comment) => {
    if (comment.parent_comment_id) {
      // If the comment has a parent, push it to the parent's replies array
      if (commentMap[comment.parent_comment_id]) {
        commentMap[comment.parent_comment_id].replies.push(
          commentMap[comment._id]
        );
      }
    } else {
      // Otherwise, it's a top-level comment
      nested.push(commentMap[comment._id]);
    }
  });
  return nested;
};

// Recursively count a nested comments structure
const countNestedComments = (comments) => {
  return comments.reduce((total, comment) => {
    return total + 1 + countNestedComments(comment.replies || []);
  }, 0);
};

// Recursive component to render a comment and its nested replies


const VideoItem = ({ video }) => {
  const containerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const [muted, setMuted] = useState(true);
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const nestedComments = useMemo(() => nestComments(comments), [comments]);
  const totalCommentCount = useMemo(
    () => countNestedComments(nestedComments),
    [nestedComments]
  );

  // Calculate the position for the modal relative to the video container
  const updateModalPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top, // relative to viewport
        left: rect.right + 10, // 10px gap to the right
      });
    }
  };

  // Update modal position when comments are opened and on window resize
  useEffect(() => {
    if (openComments) {
      updateModalPosition();
      window.addEventListener("resize", updateModalPosition);
    }
    return () => window.removeEventListener("resize", updateModalPosition);
  }, [openComments]);

  // useEffect(() => {
  //   fetchComments();
  // }, []);

  useEffect(() => {
    if (openComments) {
      fetchComments();
    }
  }, [openComments]);

  const handleOpenComments = () => {
    setOpenComments(true);
  };

  const handleCloseComments = () => {
    setOpenComments(false);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `api/comments/${video._id}`,
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  return (
    <div
      ref={(node) => {
        ref(node);
        containerRef.current = node;
      }}
      className="relative w-full rounded-lg shadow-lg"
      // Remove overflow-hidden if it was clipping your modal
    >
      {/* Video Player */}
      <div className="relative w-full aspect-[9/16] mx-auto">
        <ReactPlayer
          url={video.videoUrl}
          playing={inView}
          loop
          width="100%"
          height="100%"
          muted={muted}
          className="rounded-lg absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-2 right-2">
        <IconButton
          onClick={toggleMute}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          size="small"
        >
          {muted ? (
            <VolumeOffIcon style={{ color: "#fff" }} />
          ) : (
            <VolumeUpIcon style={{ color: "#fff" }} />
          )}
        </IconButton>
      </div>

      {/* Vertical Overlay on the Right */}
      <div className="absolute bottom-0 -right-0 transform -translate-y-1/2 flex flex-col items-center space-y-4">
        <div className="bg-opacity-50 p-2 rounded-full text-white text-sm">
          <TiStarFullOutline size={30} color="#fff" />
        </div>
        <div className="bg-opacity-50 p-2 rounded-full text-white text-sm flex flex-col items-center justify-center">
          <BsChatDots
            onClick={handleOpenComments}
            size={24}
            color="#fff"
            className="cursor-pointer"
          />
          <span className="mt-1 text-xs">{totalCommentCount}</span>
        </div>

        <div className="bg-opacity-50 p-2 rounded-full text-white text-sm">
          <AiOutlineShareAlt size={25} color="#fff" />
        </div>
        <div className="bg-opacity-50 p-2 rounded-full text-white text-sm">
          <AiOutlineEllipsis size={27} color="#fff" />
        </div>
      </div>

      {/* Overlay Container for Video Info */}
      <div className="absolute bottom-5 left-0 right-4 p-4 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={video.photo_url ? video.photo_url : userImage}
            alt="User profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-lg font-semibold text-white drop-shadow-lg">
            {video.username}
          </span>
        </div>
        <p className="text-sm text-white drop-shadow-md">{video.description}</p>
      </div>

      {/* Comments Modal using MUI Modal */}
      <Modal
        open={openComments}
        onClose={handleCloseComments}
        aria-labelledby="comments-modal-title"
        aria-describedby="comments-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: modalPosition.top,
            left: modalPosition.left,
            width: 300,
            maxHeight: "80vh",
            bgcolor: colors.bioModal,
            p: 2,
            overflowY: "auto",
            border: "none",
            borderRadius: 2,
            outline: "none", // Remove default focus outline
            "&:focus": { outline: "none" },
          }}
        >
           <IconButton
            onClick={handleCloseComments}
            sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="white" gutterBottom>
            Comments
          </Typography>
          {nestedComments.length > 0 ? (
            nestedComments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          ) : (
            <Typography variant="body2" color="white">
              No comments yet
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default VideoItem;
