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

function FeedCommentsDouble(props) {
  const settings = useContentSetting();
  const { socket } = settings;
  const { enqueueSnackbar } = useSnackbar();
  const {
    feed_id,
    setTotalCommentCount,
    is_popup,
    handleUpdateSpecificFeed,
    handleEditComment,
    handleDeleteComment,
    feedsList,
    setCommentSelected,
    commentSelected,
    openDetailModal,
    handlePostDetail,
    setShowAddComment,
    showAddComment,
  } = props;
  const [comments, setComments] = useState([]);
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
    setCommentInput(selected_comment.message);
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
      // getFeedsComments("all");
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
      // handleUpdateSpecificFeed(selectedComment._id);
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
    const formData = new FormData();
    formData.append("feed", feed_id);
    formData.append("message", commentInput);
    const result = await add_feed_comment(formData);
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
      setShowEmojiPicker(false);
      setIsLoadingForm(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    const formData = new FormData();
    formData.append("message", commentInput);
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
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const getFeedsComments = async (type) => {
    const formData = new FormData();
    formData.append("feed_id", feed_id);
    setIsLoadingMore(true);

    if (type === "next") {
      api_path = loadMore;
    }

    const result = await get_feeds_commnets(api_path, formData);
    if (result.code === 200) {
      if (type === "next") {
        var newArray = comments.concat(result.comment);
        setComments(newArray);
      } else {
        setComments(result.comment);
      }

      setPageNumber(pageNumber + 1);
      setTotalPages(result.total_pages);
      setLoadMore(result.load_more);
      setIsLoadingMore(false);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };
  const loadMoreData = () => {
    getFeedsComments("next");
  };

  useEffect(() => {
    getFeedsComments("all");
  }, [feed_id]);

  useEffect(() => {
    let count = comments.length;
    comments.map((comment, i) => {
      count = count + comment?.child_comment?.length;
    });
    setTotalCommentCount(count);
  }, [comments]);

  const update_comment_likes_by_socket = (data) => {
    setComments((comments) => {
      const comment_list = comments.map((comment) => {
        if (data.child_comment) {
          let set_comment = {};
          set_comment = {
            ...comment,
            child_comment: comment.child_comment.map((single_child_comment) => {
              let child_comment_object = {};
              if (single_child_comment._id == data.comment) {
                child_comment_object = {
                  ...single_child_comment,
                  like_count: data.action_response.comment_like_count,
                };
                if (settings.userInfo._id == data.action_by) {
                  child_comment_object.is_liked = data.action_response.is_liked;
                }
                return child_comment_object;
              } else {
                return single_child_comment;
              }
            }),
          };
          return set_comment;
        } else {
          let set_comment = {};
          if (comment._id === data.comment) {
            set_comment = {
              ...comment,
              like_count: data.action_response.comment_like_count,
            };
            if (settings.userInfo._id == data.action_by) {
              set_comment.is_liked = data.action_response.is_liked;
            }
            return set_comment;
          } else {
            return comment;
          }
        }
      });
      return comment_list;
    });
  };

  const add_comment_by_socket = (data) => {
    if (data.feed_id !== feed_id) {
      return;
    }

    let set_comment = {};
    if (settings.userInfo._id == data.action_by) {
      set_comment = {
        ...data.action_response.comment,
        comment_is_self: true,
      };
    } else {
      set_comment = data.action_response.comment;
    }
    setComments((comments) => [set_comment, ...comments]);
  };

  const edit_comment_by_socket = (data) => {
    setComments((comments) => {
      const comment_list = comments.map((comment) => {
        let set_comment = {};
        if (comment._id === data.comment) {
          if (settings.userInfo._id == data.action_by) {
            set_comment = {
              ...comment,
              message: data.action_response.comment.message,
              comment_is_self: true,
            };
          } else {
            set_comment = {
              ...comment,
              message: data.action_response.comment.message,
            };
          }
          return set_comment;
        } else {
          return comment;
        }
      });
      return comment_list;
    });
  };
  const delete_comment_by_socket = (data) => {
    setComments((comments) => {
      const comment_list = comments.filter(
        (comment) => comment._id !== data.comment
      );
      return comment_list;
    });
  };

  const add_comment_reply_by_socket = (data) => {
    setComments((comments) => {
      const comment_list = comments.map((comment) => {
        let set_comment = {};
        if (comment._id === data.parent_comment) {
          let child_comments_array = data.child_comments_array.map((child) => {
            let set_comment_object = {};
            if (
              child.user_info_action_for.action_id === settings.userInfo._id
            ) {
              set_comment_object = {
                ...child,
                comment_is_self: true,
              };
            } else {
              set_comment_object = {
                ...child,
                comment_is_self: false,
              };
            }
            return set_comment_object;
          });

          set_comment = {
            ...comment,
            child_comment: child_comments_array,
          };
          return set_comment;
        } else {
          return comment;
        }
      });
      return comment_list;
    });
  };

  const edit_comment_reply_by_socket = (data) => {
    setComments((comments) => {
      const comment_list = comments.map((comment) => {
        let set_comment = {};
        if (comment._id === data.parent_comment) {
          let child_comments_array = comment.child_comment.map(
            (child_comment_object) => {
              let set_comment_object = {};
              if (data.comment === child_comment_object._id) {
                if (settings.userInfo._id === data.action_by) {
                  set_comment_object = {
                    ...child_comment_object,
                    message: data.action_response.comment.message,
                    comment_is_self: true,
                  };
                } else {
                  set_comment_object = {
                    ...child_comment_object,
                    message: data.action_response.comment.message,
                  };
                }
                return set_comment_object;
              } else {
                return child_comment_object;
              }
            }
          );
          set_comment = {
            ...comment,
            child_comment: child_comments_array,
          };

          return set_comment;
        } else {
          return comment;
        }
      });
      return comment_list;
    });
  };

  const delete_comment_reply_by_socket = (data) => {
    setComments((comments) => {
      const comments_list = comments.map((comment) => {
        let set_comment = {};
        const array_filtered = comment.child_comment.filter(
          (child_comment) => child_comment._id !== data.comment
        );
        set_comment = {
          ...comment,
          child_comment: array_filtered,
        };
        return set_comment;
      });
      return comments_list;
    });
  };

  // useEffect(() => {
  //   socket.emit("live_event_room", "live_feed_room");
  //   socket.on("live_feed_room_reciever", (data) => {
  //     if (data.action === "commentlike" || data.action === "commentunlike") {
  //       update_comment_likes_by_socket(data);
  //     } else if (data.action === "add_comment") {
  //       add_comment_by_socket(data);
  //     } else if (data.action === "edit_comment") {
  //       edit_comment_by_socket(data);
  //     } else if (data.action === "delete_comment") {
  //       delete_comment_by_socket(data);
  //     } else if (data.action === "add_comment_reply") {
  //       add_comment_reply_by_socket(data);
  //     } else if (data.action === "edit_comment_reply") {
  //       edit_comment_reply_by_socket(data);
  //     } else if (data.action === "delete_comment_reply") {
  //       delete_comment_reply_by_socket(data);
  //     }
  //   });

  //   return () => {
  //     // socket.off("live_feed_room_reciever");
  //   };
  // }, [feed_id]);

  // if (isLoading) {
  //   return (
  //     <div className="text-center">
  //       <CircularProgress
  //         className="mt-3"
  //         style={{ width: 20, height: 20 }}
  //         color="primary"
  //       />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="profile-comments profile-main-comments">
        {feedsList.length > 0 &&
          feedsList.map((comment, index) => (
            <>
              {index < 2 && (
                <SingleComment
                  comment={comment}
                  is_popup={is_popup}
                  handleCommentEdit={handleEditComment}
                  handleCommentDelete={handleDeleteComment}
                  handleUpdateSpecificFeed={handleUpdateSpecificFeed}
                  openDetailModal={openDetailModal}
                  handlePostDetail={handlePostDetail}
                  feed_id={feed_id}
                  setShowAddComment={setShowAddComment}
                  showAddComment={showAddComment}
                />
              )}
            </>
          ))}
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

export default FeedCommentsDouble;
