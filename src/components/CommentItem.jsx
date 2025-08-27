import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import moment from "moment";
import { userImage } from "../assets/images";

const CommentItem = ({ comment, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const formattedRelativeDate = moment(comment.created_at).fromNow();

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <Box sx={{ ml: level * 2, mb: 2, pb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <img
          src={comment.photo_url ? comment.photo_url : userImage}
          alt={`${comment.username}'s avatar`}
          className="w-8 h-8 rounded-full mr-3"
        />
        <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }} color="white">
            {comment.username}
          </Typography>
          <Typography sx={{ fontSize: "14px" }} color="white">
            {comment.message}
          </Typography>
          <Box
            sx={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography variant="caption" color="gray">
              {formattedRelativeDate}
            </Typography>
            <Typography
              variant="caption"
              color="white"
              sx={{ fontSize: "11px", ml: 1, cursor: "pointer" }}
            >
              Reply
            </Typography>
            {comment.replies && comment.replies.length > 0 && (
              <Typography
                variant="caption"
                color="white"
                sx={{ fontSize: "11px", ml: 1, cursor: "pointer" }}
                onClick={toggleReplies}
              >
                {showReplies
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length > 1 ? "Replies" : "Reply"
                    }`}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      {comment.replies && comment.replies.length > 0 && showReplies && (
        <Box sx={{ mt: 1 }}>
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} level={level + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;
