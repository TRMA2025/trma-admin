import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { emoji_picker_icon } from "src/assets";
import { useRef } from "react";
import EmojiPicker from "src/components/EmojiPicker";
import { useContentSetting } from "src/Hooks/ContentSettingState";
import {
  add_feed_comment,
  edit_feed_comment,
} from "src/DAL/CommunityArea/Comments";

export default function AddComment({
  post_id,
  feedsData,
  formAction,
  setFormAction,
  setShowAddComment,
  handleUpdateSpecificFeed,
  setCommentSelected,
  commentSelected,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState("");
  const [commentId, setCommentId] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const settings = useContentSetting();
  const inputRef = useRef(null);
  const { socket } = useContentSetting();

  //Adding Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = {
      feed: post_id,
      text: state,
    };
    console.log(postData, "====postData");

    const result = await add_feed_comment(postData);
    if (result.code === 200) {
      // const socketData = {
      //   action: "add_comment",
      //   feed_id: post_id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };
      socket.emit("send_notification_count", result?.receiver_members);
      handleUpdateSpecificFeed(post_id);
      setState("");
      setShowEmojiPicker(false);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("text", state);
    const postData = {
      text: state,
    };
    const result = await edit_feed_comment(postData, commentId);
    if (result.code === 200) {
      // const socketData = {
      //   action: "edit_comment",
      //   feed_id: post_id,
      //   comment: commentId,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };

      // socket.emit("feed_room_action_event", socketData);
      handleUpdateSpecificFeed(post_id);
      setState("");
      setShowEmojiPicker(false);
      setIsLoading(false);
      setFormAction("ADD");
      setShowAddComment(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setState(value);
  };

  const handleCancelUpdate = (e) => {
    e.preventDefault();
    setState("");
    setFormAction("ADD");
    setShowAddComment(false);
  };

  useEffect(() => {
    if (formAction === "EDIT") {
      // setState(feedsData.comment[0].message);
      setState(commentSelected.text);
      setCommentId(commentSelected._id);
    }
  }, [formAction]);

  return (
    <>
      <div className="new-memories">
        <form onSubmit={formAction === "ADD" ? handleSubmit : handleUpdate}>
          <TextField
            inputRef={inputRef}
            className="mt-2 inputs-fields"
            id="outlined-multiline-static"
            placeholder="Write a comment…"
            multiline
            rows={3}
            name="description"
            value={state}
            variant="outlined"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
            required={true}
            onChange={(e) => handleChange(e)}
            autoFocus
          />
          <div className="d-flex justify-content-between">
            <div className="text-start mt-3 mb-2 event-chat-emoji-picker-button">
              <img
                src={emoji_picker_icon}
                onClick={() => {
                  setShowEmojiPicker((prevState) => !prevState);
                }}
              />
            </div>
            <div className="text-end mt-3">
              {formAction === "ADD" && (
                <button className="comment-submit-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Post Comment"}
                </button>
              )}
              {formAction === "EDIT" && (
                <div className="d-flex justify-content-end">
                  <button
                    className="me-2 comment-submit-button"
                    onClick={handleCancelUpdate}
                  >
                    Cancel
                  </button>
                  <button
                    className="comment-submit-button"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              )}
            </div>
          </div>
          {showEmojiPicker && (
            <div className="col-12 mt-4 mt-lg-0 ms-auto">
              <EmojiPicker inputRef={inputRef} setInput={setState} />
            </div>
          )}
        </form>
      </div>
    </>
  );
}
