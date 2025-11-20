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
import { community_feed_action } from "src/DAL/CommunityArea/Community";
// import { useContentSetting } from "src/Hooks/ContentSettingState";
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

import EmojiPicker from "../EmojiPicker";
import ShowCommentLikes from "./ShowCommentLikes";
import CustomConfirmation from "../ModalPopover/Confirmation";
import { useContentSetting } from "src/Hooks/ContentSettingState";

function DoubleComments(props) {
  const {
    comment,
    handleCommentEdit,
    handleCommentDelete,
    childComponent,
    handleUpdateSpecificFeed,
    is_popup,
  } = props;
  const settings = useContentSetting();
  const inputRef = useRef(null);
  // const { socket, userInfo } = settings;
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
    setInputReply(selected_comment.message);
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
      handleUpdateSpecificFeed(comment.feeds);
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

  if (comment?.comment_is_self == true) {
    MENU_OPTIONS.push(
      {
        label: "Edit",
        icon: "akar-icons:edit",
        handleClick: childComponent ? handleReplyEdit : handleCommentEdit,
      },
      {
        label: "Delete",
        icon: "ant-design:delete-twotone",
        handleClick: childComponent
          ? handleChildCommentDelete
          : handleCommentDelete,
      }
    );
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
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputReply((msg) => msg + emoji.native);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("feed", comment.feeds);
    formData.append("parent_comment", comment._id);
    formData.append("message", inputReply);
    const result = await add_feed_comment(formData);

    if (result.code === 200) {
      handleUpdateSpecificFeed(comment.feeds);
      setIsSubmittedChild(!isSubmittedChild);
      setInputReply("");
      setIsShowReplyInput(false);
      let updated_child_comments_array = [
        ...clildComments,
        result.action_response.comment,
      ];

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
    const formData = new FormData();
    formData.append("message", inputReply);
    const result = await edit_feed_comment(formData, selectedComment._id);
    if (result.code === 200) {
      handleUpdateSpecificFeed(comment.feeds);

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

  const handleFeedAction = async (comment_id, feed_id, action) => {
    if (action === "commentlike") {
      setIsLikedComment(true);
    } else {
      setIsLikedComment(false);
    }
    const formData = new FormData();
    formData.append("action", action);
    formData.append("feed", feed_id);
    formData.append("comment", comment_id);
    const result = await community_feed_action(formData);
    if (result.code === 200) {
      setCommentLikeCount(result.action_response.comment_like_count);
      setIsLikedComment(result.action_response.is_liked);
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

      // socket.emit("feed_room_action_event", socketData);
    } else {
      if (action === "commentlike") {
        setIsLikedComment(false);
      } else {
        setIsLikedComment(true);
      }
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  useEffect(() => {
    setIsLikedComment(comment?.is_liked);
    setCommentLikeCount(comment?.like_count);
    setClildComments(comment?.child_comment);
  }, [comment, isSubmittedChild]);

  return (
    <>
      {comment &&
        comment.map((value, index) => (
          <>
            {index < 2 && (
              <SingleComment
                comment={comment}
                is_popup={is_popup}
                handleCommentEdit={handleCommentEdit}
                handleCommentDelete={handleCommentDelete}
                handleUpdateSpecificFeed={() => {
                  getFeedsComments("all");
                }}
              />
            )}
          </>
        ))}
      {openLikesModal === true && (
        <ShowCommentLikes
          openLikesModal={openLikesModal}
          setOpenLikesModal={setOpenLikesModal}
          comment_id={value._id}
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

export default DoubleComments;
