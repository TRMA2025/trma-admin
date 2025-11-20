import { Chip, Tooltip } from "@mui/material";
import React from "react";
import { communityHandScreenshot, communityHeart } from "src/assets";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function HandleAction({
  isLiked,
  handleFeedAction,
  feeds_type,
  setShowAddComment,
  feed_id,
  commentCount,
  showAddComment,
}) {
  const handleShowReplyInput = () => {
    if (showAddComment) {
      setShowAddComment(false);
    } else {
      setShowAddComment(true);
    }
  };
  return (
    <div className="row comment-icon">
      <div className="col-1"></div>
      <div className="col-4 svg-color comment-icons text-center">
        {isLiked ? (
          <Chip
            label={
              <span className="d-flex">
                <img src={communityHeart} alt="" />
                &nbsp; Liked
              </span>
            }
            variant="outlined"
            onClick={() => {
              handleFeedAction(feed_id, "feedunlike");
            }}
          />
        ) : (
          <Chip
            label={
              <span className="d-flex">
                <FavoriteBorderIcon /> &nbsp;Like
              </span>
            }
            variant="outlined"
            onClick={() => {
              handleFeedAction(feed_id, "feedlike");
            }}
          />
        )}
      </div>
      <div className="col-2"></div>
      <div className="col-4 svg-color comment-icons text-center">
        <Chip
          onClick={handleShowReplyInput}
          label={
            <>
              {commentCount > 0 && <span>{`(${commentCount})`}</span>}
              <ChatBubbleOutlineIcon />
              &nbsp; Comment
            </>
          }
          variant="outlined"
        />
      </div>
      <div className="col-1"></div>
    </div>
  );
}
