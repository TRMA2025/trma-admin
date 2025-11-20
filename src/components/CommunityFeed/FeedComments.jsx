import { CircularProgress, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  add_feed_comment,
  delete_comment_api,
  edit_feed_comment,
  get_feeds_commnets,
} from "src/DAL/CommunityArea/Comments";
import { useContentSetting } from "src/Hooks/ContentSettingState";
import { emoji_picker_icon } from "src/assets";

import EmojiPicker from "../EmojiPicker";
import SingleComment from "./SingleComment";
import CustomConfirmation from "../ModalPopover/Confirmation";
import { get_feeds_detail } from "src/DAL/CommunityArea/Community";

function FeedComments(props) {
  const settings = useContentSetting();
  const { socket } = useContentSetting();
  const { enqueueSnackbar } = useSnackbar();
  const {
    feed_id,
    setTotalCommentCount,
    is_popup,
    getFeedsListingOnAddFeed,
    feedDetail,
    getFeedsDeteil,
  } = props;
  const [comments, setComments] = useState([]);
  const [feedDetailComments, setFeedDetailComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadMore, setLoadMore] = useState(
    "api/feeds/comment_by_feed?page=0&limit=10"
  );
  // default
  let api_path = "api/feeds/comment_by_feed?page=0&limit=10";

  // comments add / edit
  const [formAction, setFormAction] = useState("ADD");
  const [commentInput, setCommentInput] = useState("");
  const [selectedComment, setSelectedComment] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const observer = useRef();

  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && totalPages > pageNumber) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, totalPages, pageNumber, loadMore, observer]
  );

  const handleChange = (event) => {
    const value = event.target.value;
    setCommentInput(value);
  };

  const handleCommentEdit = (selected_comment) => {
    setSelectedComment(selected_comment);
    setCommentInput(selected_comment.text);
    setFormAction("EDIT");
  };

  const handleCommentDelete = (selected_comment) => {
    setOpenDelete(true);
    setSelectedComment(selected_comment);
  };

  //Deleting Category
  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await delete_comment_api(selectedComment._id);
    if (result.code === 200) {
      getFeedsComments("all");
      // const socketData = {
      //   action: "delete_comment",
      //   feed_id: feed_id,
      //   comment: selectedComment._id,
      //   token: localStorage.getItem("token"),
      //   action_response: result.action_response,
      //   creator_id: result.action_response.creator_id,
      // };

      // socket.emit("feed_room_action_event", socketData);
      // enqueueSnackbar(result.message, { variant: "success" });
      getFeedsListingOnAddFeed(feed_id);
      getFeedsDeteil();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleCancelUpdate = (e) => {
    e.preventDefault();
    setCommentInput("");
    setFormAction("ADD");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    const postData = {
      feed: feed_id,
      // parent_comment: "65ccb3b64fcaece4a8f289f7",
      text: commentInput,
    };
    const result = await add_feed_comment(postData);
    if (result.code === 200) {
      getFeedsComments("all");
      setCommentInput("");
      // const socketData = {
      //   action: "add_comment",
      //   feed_id: feed_id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };

      // socket.emit("feed_room_action_event", socketData);
      socket.emit("send_notification_count", result?.receiver_members);
      setShowEmojiPicker(false);
      getFeedsDeteil();
      setIsLoadingForm(false);
      getFeedsListingOnAddFeed(feed_id);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    const formData = new FormData();
    formData.append("text", commentInput);
    const result = await edit_feed_comment(formData, selectedComment._id);
    if (result.code === 200) {
      getFeedsComments("all");
      setCommentInput("");
      // const socketData = {
      //   action: "edit_comment",
      //   feed_id: feed_id,
      //   comment: selectedComment._id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };

      // socket.emit("feed_room_action_event", socketData);
      setCommentInput("");
      setShowEmojiPicker(false);
      setIsLoadingForm(false);
      setFormAction("ADD");
      getFeedsListingOnAddFeed(feed_id);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const getFeedsCommentsold = async (type) => {
    const formData = new FormData();
    formData.append("feed_id", feed_id);
    setIsLoadingMore(true);

    if (type === "next") {
      api_path = loadMore;
    }
    setComments(feedDetail.comments);

    // const result = await get_feeds_commnets(api_path, formData);
    // if (result.code === 200) {
    //   if (type === "next") {
    //     var newArray = comments.concat(result.comment);
    //     setComments(newArray);
    //   } else {
    //     setComments(result.comment);
    //   }

    //   setPageNumber(pageNumber + 1);
    //   setTotalPages(result.total_pages);
    //   setLoadMore(result.load_more);
    setIsLoadingMore(false);
    setIsLoading(false);
    // } else {
    //   enqueueSnackbar(result.message, { variant: "error" });
    //   setIsLoading(false);
    //   setIsLoadingMore(false);
    // }
  };
  const getFeedsComments = async () => {
    const result = await get_feeds_detail(feed_id);
    if (result.code === 200) {
      setFeedDetailComments(result.feed.comments);
      setIsLoadingMore(false);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  };
  const loadMoreData = () => {
    getFeedsComments("next");
  };

  useEffect(() => {
    getFeedsComments("all");
  }, [feed_id]);

  return (
    <>
      <div className="profile-comments profile-main-comments">
        {feedDetailComments.length > 0 &&
          feedDetailComments.map((comment) => {
            return (
              <SingleComment
                comment={comment}
                is_popup={is_popup}
                handleCommentEdit={handleCommentEdit}
                handleCommentDelete={handleCommentDelete}
                openDetailModal={true}
                handleUpdateSpecificFeed={() => {
                  getFeedsComments("all");
                }}
              />
            );
          })}
        {totalPages > pageNumber ? (
          <div className="view-comment mt-2 text-end me-3 date-color">
            {isLoadingMore ? (
              <span onClick={loadMoreData}>Loading...</span>
            ) : (
              <span
                ref={lastBookElementRef}
                onClick={loadMoreData}
                id="load-more-comments"
              >
                View more comments
              </span>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="new-memories mt-2">
        <form onSubmit={formAction === "ADD" ? handleSubmit : handleUpdate}>
          <TextField
            inputRef={inputRef}
            className="mt-2 inputs-fields"
            id="outlined-multiline-static"
            placeholder="Write a comment…"
            multiline
            rows={3}
            name="description"
            value={commentInput}
            variant="outlined"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
            required={true}
            onChange={(e) => handleChange(e)}
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
                <button
                  className="comment-submit-button"
                  disabled={isLoadingForm}
                >
                  {isLoadingForm ? "Saving..." : "Post Comment"}
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
                    disabled={isLoadingForm}
                  >
                    {isLoadingForm ? "Updating..." : "Update"}
                  </button>
                </div>
              )}
            </div>
          </div>
          {showEmojiPicker && (
            <div className="col-12 mt-4 mt-lg-0 ms-auto">
              <EmojiPicker inputRef={inputRef} setInput={setCommentInput} />
            </div>
          )}
        </form>
      </div>
      <CustomConfirmation
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title={"Are you sure you want to delete this comment?"}
        handleAgree={handleDelete}
      />
    </>
  );
}

export default FeedComments;
