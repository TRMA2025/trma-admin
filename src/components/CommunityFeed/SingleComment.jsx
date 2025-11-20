import {
  Avatar,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { s3baseUrl } from "src/config/config";
import {
  community_feed_action,
  community_feed_action_for_comments,
} from "src/DAL/CommunityArea/Community";
import { useContentSetting } from "src/Hooks/ContentSettingState";
// import {
//   get_date_with_user_time_zone,
//   get_short_string,
//   is_small_screen,
//   LONG_TEXT_LIMIT,
// } from "src/utils/constant";
import { htmlDecode } from "src/utils/convertHtml";
import {
  add_feed_comment,
  comment_detail_api,
  delete_comment_api,
  edit_feed_comment,
} from "src/DAL/CommunityArea/Comments";
import { communityHeart, emoji_picker_icon } from "src/assets";

import moment from "moment";
import {
  get_date_of_user_time_zone,
  is_small_screen,
} from "src/utils/constant";

import EmojiPicker from "../EmojiPicker";
import ShowCommentLikes from "./ShowCommentLikes";
import CustomConfirmation from "../ModalPopover/Confirmation";
import CustomPopover from "../MenuOption/CustomPopover";

function SingleComment(props) {
  const {
    comment,
    handleCommentEdit,
    handleCommentDelete,
    childComponent,
    handleUpdateSpecificFeed,
    is_popup,
    openDetailModal,
    handlePostDetail,
    feed_id,
    setShowAddComment,
    showAddComment,
  } = props;
  const { socket } = useContentSetting();
  const inputRef = useRef(null);
  const [isShowCommentMore, setIsShowCommentMore] = useState(true);
  const [inputReply, setInputReply] = useState("");
  const [isLikedComment, setIsLikedComment] = useState(false);
  const [isSubmittedChild, setIsSubmittedChild] = useState(false);
  const [clildComments, setClildComments] = useState([]);
  const [isShowReplyInput, setIsShowReplyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedComment, setSelectedComment] = useState({});
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [formAction, setFormAction] = useState("ADD");
  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleReplyEdit = (selected_comment) => {
    setSelectedComment(selected_comment);
    setInputReply(selected_comment.text);
    setFormAction("EDIT");
    setIsShowReplyInput(true);
  };

  const handleChildCommentDelete = (selected_comment) => {
    setOpenDeleteComment(true);
    setSelectedComment(selected_comment);
  };

  //Deleting Category
  const handleDelete = async () => {
    setOpenDeleteComment(false);
    const result = await delete_comment_api(selectedComment._id);
    if (result.code === 200) {
      handleUpdateSpecificFeed(comment.feed);
      setIsSubmittedChild(!isSubmittedChild);
      // const socketData = {
      //   action: "delete_comment_reply",
      //   feed_id: selectedComment.feeds,
      //   comment: selectedComment._id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_response: result.action_response,
      // };
      // socket.emit("feed_room_action_event", socketData);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const MENU_OPTIONS = [];

  if (comment?.is_self == true) {
    MENU_OPTIONS.push({
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: childComponent ? handleReplyEdit : handleCommentEdit,
    });
  }
  if (comment?.is_self == true || comment?.can_delete == true) {
    MENU_OPTIONS.push({
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: childComponent
        ? handleChildCommentDelete
        : handleCommentDelete,
    });
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setInputReply(value);
  };

  const handleShowReplyInput = () => {
    if (isShowReplyInput) {
      setIsShowReplyInput(false);
    } else {
      setIsShowReplyInput(true);
      setShowAddComment(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputReply((msg) => msg + emoji.native);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = {
      feed: comment.feed,
      parent_comment: comment._id,
      text: inputReply,
    };

    const result = await add_feed_comment(postData);

    if (result.code === 200) {
      handleUpdateSpecificFeed(comment.feed);
      setIsSubmittedChild(!isSubmittedChild);
      setInputReply("");
      setIsShowReplyInput(false);
      // let updated_child_comments_array = [
      //   ...clildComments,
      //   result.action_response.comment,
      // ];

      // const socketData = {
      //   action: "add_comment_reply",
      //   feed_id: comment.feeds,
      //   parent_comment: comment._id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      //   child_comments_array: updated_child_comments_array,
      // };
      socket.emit("send_notification_count", result?.receiver_members);
      // socket.emit("feed_room_action_event", socketData);
      setShowEmojiPicker(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const postData = {
      text: inputReply,
    };
    const result = await edit_feed_comment(postData, selectedComment._id);
    if (result.code === 200) {
      handleUpdateSpecificFeed(comment.feed);

      setIsSubmittedChild(!isSubmittedChild);
      setInputReply("");
      setIsShowReplyInput(false);
      setFormAction("ADD");
      // const socketData = {
      //   action: "edit_comment_reply",
      //   feed_id: comment.feeds,
      //   comment: selectedComment._id,
      //   parent_comment: result.action_response.comment.parent_comment,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };
      // socket.emit("feed_room_action_event", socketData);
      setShowEmojiPicker(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleFeedAction = async (comment_id, action) => {
    if (action === "commentlike") {
      setIsLikedComment(true);
    } else {
      setIsLikedComment(false);
    }
    const formData = new FormData();
    const result = await community_feed_action_for_comments(comment_id);
    if (result.code === 200) {
      setCommentLikeCount(result.feed_comment.liked_by?.length);
      handleUpdateSpecificFeed(comment.feed);
      // setIsLikedComment(result.action_response.is_liked);
      // const socketData = {
      //   action,
      //   feed_id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   comment: comment_id,
      //   action_response: result.action_response,
      //   child_comment: childComponent,
      // };
      socket.emit("send_notification_count", result?.receiver_members);

      // socket.emit("feed_room_action_event", socketData);
    } else {
      // if (action === "commentlike") {
      //   setIsLikedComment(false);
      // } else {
      //   setIsLikedComment(true);
      // }
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    setIsLikedComment(comment?.liked_by_me);
    setCommentLikeCount(comment?.liked_by?.length);
    setClildComments(comment?.child_comments);
  }, [comment, isSubmittedChild]);
  useEffect(() => {
    if (showAddComment) {
      setIsShowReplyInput(false);
    }
  }, [showAddComment]);
  return (
    <>
      {comment && (
        <div
          className={`${
            !childComponent
              ? "mt-3 position-relative profile-comments"
              : "position-relative profile-comments"
          }`}
        >
          <div className="">
            <div className="col-12">
              <div className="poster-name-image d-flex w-100 single-comment-card">
                <Avatar
                  src={s3baseUrl + comment?.commented_by?.profile_image}
                  alt="photoURL"
                >
                  {comment?.commented_by?.name}
                </Avatar>
                <div className="w-100">
                  <div className="text-start set-title-width poster-name ps-2 w-100">
                    <span className="card-title mb-0">
                      {htmlDecode(comment?.commented_by?.name)}
                    </span>

                    {!is_small_screen() && (
                      <span className="date-color float-end pe-4 me-2">
                        {/* {get_date_of_user_time_zone(
                          comment?.comment_date_time,
                          "DD MMM YYYY [at] hh:mm A",
                          userInfo?.userInfo?.time_zone
                        )} */}
                        {moment(comment?.createdAt).format(
                          "DD MMM YYYY [at] hh:mm A"
                        )}
                      </span>
                    )}
                  </div>
                  {is_small_screen() && (
                    <span className="date-color ps-2">
                      {/* {get_date_of_user_time_zone(
                        comment?.comment_date_time,
                        "DD MMM YYYY [at] hh:mm A",
                        userInfo?.userInfo?.time_zone
                      )} */}
                      {/* {moment(comment?.comment_date_time).format(
                        "DD MMM YYYY [at] hh:mm A"
                      )} */}
                      {moment(comment?.createdAt).format(
                        "DD MMM YYYY [at] hh:mm A"
                      )}
                    </span>
                  )}
                  <div className="post-description mt-1 ps-2">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: htmlDecode(comment?.text),
                      }}
                      className="text-start date-color mb-0"
                    ></span>
                    <div className="like-comment text-start date-color mt-1 d-flex justify-content-between likes-post">
                      <div className="like-reply-box">
                        <span
                          className={`${isLikedComment ? "liked-comment" : ""}`}
                          onClick={() => {
                            handleFeedAction(
                              comment?._id,
                              isLikedComment === true
                                ? "commentunlike"
                                : "commentlike"
                            );
                          }}
                        >
                          {isLikedComment === true ? "Liked" : "Like"}
                        </span>
                        {!childComponent && (
                          <span onClick={handleShowReplyInput}>Reply</span>
                        )}
                      </div>
                      {commentLikeCount > 0 && (
                        <Tooltip title={`${commentLikeCount} Likes`}>
                          <div
                            className="d-flex comment-like-heart"
                            onClick={() => {
                              setOpenLikesModal(true);
                            }}
                          >
                            <div className="comment-like-heart-image">
                              <img src={communityHeart} alt="" />
                            </div>
                            {commentLikeCount > 0 && (
                              <div className="comment-like-heart-count">
                                {commentLikeCount}
                              </div>
                            )}
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {clildComments && (
              <>
                {openDetailModal == false ? (
                  <>
                    <div>
                      <div className="col-1"></div>
                      <div className="col-11 mt-2 ms-auto">
                        <SingleComment
                          comment={clildComments[0]}
                          handleCommentEdit={handleCommentEdit}
                          handleCommentDelete={handleCommentDelete}
                          handleUpdateSpecificFeed={handleUpdateSpecificFeed}
                          childComponent={true}
                          is_popup={is_popup}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {clildComments.map((child_comment, index) => {
                      return (
                        <div key={index}>
                          <div className="col-1"></div>
                          <div className="col-11 mt-2 ms-auto">
                            {openDetailModal == false ? (
                              <>
                                {index < 2 && (
                                  <SingleComment
                                    comment={child_comment}
                                    handleCommentEdit={handleCommentEdit}
                                    handleCommentDelete={handleCommentDelete}
                                    handleUpdateSpecificFeed={
                                      handleUpdateSpecificFeed
                                    }
                                    childComponent={true}
                                    is_popup={is_popup}
                                    key={index}
                                  />
                                )}
                              </>
                            ) : (
                              <SingleComment
                                comment={child_comment}
                                handleCommentEdit={handleCommentEdit}
                                handleCommentDelete={handleCommentDelete}
                                handleUpdateSpecificFeed={
                                  handleUpdateSpecificFeed
                                }
                                childComponent={true}
                                is_popup={is_popup}
                                key={index}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* {comment?.more_replies >= 1 && openDetailModal == false ? (
                  <>
                    <div className="col-1"></div>
                    <div className="col-11 mt-2 ms-auto">
                      <div className="d-flex justify-content-between">
                        <div className="view-comment mt-2 me-3 date-color">
                          <span onClick={() => handlePostDetail(feed_id)}>
                            View more replies
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )} */}
              </>
            )}
            {isShowReplyInput && (
              <div className="col-12">
                <div className="new-memories mt-2 w-100">
                  <FormControl variant="outlined">
                    {/* <InputLabel htmlFor="outlined-adornment-password">
                      Write a reply
                    </InputLabel> */}
                    <OutlinedInput
                      sx={{ backgroundColor: "#fff" }}
                      inputRef={inputRef}
                      multiline
                      placeholder="Write a Reply"
                      rows={3}
                      id="outlined-adornment-password"
                      type="text"
                      value={inputReply}
                      onChange={handleChange}
                      autoFocus
                      endAdornment={
                        <InputAdornment position="end">
                          {isLoading ? (
                            <IconButton
                              aria-label="toggle password visibility"
                              edge="end"
                            >
                              <SendIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={
                                formAction === "ADD"
                                  ? handleSubmit
                                  : handleUpdate
                              }
                              edge="end"
                            >
                              <SendIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      }
                      // label="Write a reply"
                    />
                  </FormControl>
                  <div className="text-start mt-3 mb-2 event-chat-emoji-picker-button">
                    <img
                      src={emoji_picker_icon}
                      onClick={() => {
                        setShowEmojiPicker((prevState) => !prevState);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {showEmojiPicker && (
              <div className="col-12 mt-4 mt-lg-0 ms-auto">
                <EmojiPicker inputRef={inputRef} setInput={setInputReply} />
              </div>
            )}
          </div>
          {(comment?.is_self == true || comment?.can_delete == true) &&
            MENU_OPTIONS.length > 0 && (
              <div className="affirmation-dots single-comment-card-dots">
                <CustomPopover menu={MENU_OPTIONS} data={comment} />
              </div>
            )}
        </div>
      )}
      {openLikesModal === true && (
        <ShowCommentLikes
          openLikesModal={openLikesModal}
          setOpenLikesModal={setOpenLikesModal}
          comment_id={comment._id}
          comment={comment}
        />
      )}
      <CustomConfirmation
        openDelete={openDeleteComment}
        setOpenDelete={setOpenDeleteComment}
        title={"Are you sure you want to delete this comment?"}
        handleAgree={handleDelete}
      />
    </>
  );
}

export default SingleComment;
