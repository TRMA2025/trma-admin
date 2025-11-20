import React, { useEffect, useState } from "react";
import { s3baseUrl } from "src/config/config";
import { useSnackbar } from "notistack";

import { delete_comment_api } from "src/DAL/CommunityArea/Comments";

import UserInfoCard from "src/components/CommunityFeed/UserInfoCard";
import ActionsCount from "src/components/CommunityFeed/ActionsCount";
import HandleAction from "src/components/CommunityFeed/HandleAction";
import { htmlDecode } from "src/utils/convertHtml";
import FeedImagesList from "src/components/CommunityFeed/FeedImagesList";
import ShowAllLikes from "src/components/CommunityFeed/ShowAllLikes";
import AddComment from "./AddComment";
import FeedComments from "src/components/CommunityFeed/FeedComments";
import SingleComment from "src/components/CommunityFeed/SingleComment";
import CustomPopover from "src/components/MenuOption/CustomPopover";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import {
  delete_feed_action,
  community_feed_action,
} from "src/DAL/CommunityArea/Community";
import { useContentSetting } from "src/Hooks/ContentSettingState";

function PostCard({
  feeds_list,
  getFeedsListingOnDelete,
  handleShowDetails,
  handleSelectedImage,
  handleFeedEdit,
  handleUpdateSpecificFeed,
  handleUpdateShowAll,
  feedsList,
  userInfo,
  openDetailModal,
}) {
  // const settings = useContentSetting();
  // const { socket, userInfo } = settings;
  const { socket } = useContentSetting();
  // const { userinfo } = useContentSetting();
  const { enqueueSnackbar } = useSnackbar();
  const [showAddComment, setShowAddComment] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [showTab, setShowTab] = useState(0);
  const [isLiked, setIsLiked] = useState(true);
  const [isGratituded, setIsGratituded] = useState(true);
  const [commetMessage, setCommetMessage] = useState({});
  const [topLikedUser, setTopLikedUser] = useState([]);
  const [topCoinedUser, setTopCoinedUser] = useState([]);
  const [openCoinsModal, setOpenCoinsModal] = useState(false);
  const [topGratitudeUser, setTopGratitudeUser] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [coinsCount, setcoinsCount] = useState(0);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const [formAction, setFormAction] = useState("ADD");
  const [selectedComment, setSelectedComment] = useState({});
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentSelected, setCommentSelected] = useState({});
  const handleFeedAction = async (id, action) => {
    if (action === "feedlike") {
      setIsLiked(true);
    } else if (action === "feedunlike") {
      setIsLiked(false);
    }
    const formData = new FormData();
    formData.append("action", action);
    formData.append("feed", id);

    const result = await community_feed_action(id);
    if (result.code === 200) {
      if (action === "feedlike" || action === "feedunlike") {
        // setTopLikedUser(result.action_response.top_liked_user);
        setLikeCount(result.feed.liked_by?.length);
        handleUpdateSpecificFeed(id);
      }

      // const socketData = {
      //   action,
      //   feed_id: id,
      //   token: localStorage.getItem("token"),
      //   creator_id: result.action_response.creator_id,
      //   action_by: result.action_response.sender,
      //   action_response: result.action_response,
      // };
      // socket.emit("feed_room_action_event", socketData);
      socket.emit("send_notification_count", result?.receiver_members);
    } else {
      if (action === "feedlike") {
        setIsLiked(false);
      } else if (action === "feedunlike") {
        setIsLiked(true);
      }
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleAgree = async () => {
    setOpenDelete(false);
    const result = await delete_feed_action(feeds_list._id);
    if (result.code === 200) {
      enqueueSnackbar("Post deleted successfully", { variant: "success" });
      getFeedsListingOnDelete(feeds_list._id);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handlePostDetail = (post_id) => {
    handleShowDetails(feeds_list);
  };

  const handleClickImage = (event, index, path) => {
    console.log(index, "index");
    handleSelectedImage(feeds_list, index);
  };

  const handleViewAllComments = (value) => {
    handleUpdateShowAll(feeds_list._id, value);
  };

  const handleOpenLikedBox = () => {
    setOpenLikesModal(true);
    setShowTab(0);
  };
  const handleOpenCoinsBox = () => {
    setOpenCoinsModal(true);
    // setShowTab(0);
  };
  const handleCloseCoinBox = () => {
    setOpenCoinsModal(false);
    setShowTab();
  };
  const call_on_comment = () => {};

  const handleOpenGratitudeBox = () => {
    setOpenLikesModal(true);
    setShowTab(2);
  };

  const handleCloseSimpleBox = () => {
    setOpenLikesModal(false);
    setShowTab();
  };

  const handleAgreeDelete = (value) => {
    setOpenDelete(true);
  };

  const handleCommentEdit = (value) => {
    console.log(value, "valuevaluevalue");
    setCommentSelected(value);
    setFormAction("EDIT");
    setShowAddComment(true);
  };

  const handleCommentDelete = (selected_comment) => {
    setOpenDeleteComment(true);
    setSelectedComment(selected_comment);
  };

  //Deleting Category
  const handleDelete = async () => {
    setOpenDeleteComment(false);
    const result = await delete_comment_api(selectedComment._id);
    if (result.code === 200) {
      handleUpdateSpecificFeed(feeds_list._id);
      // const socketData = {
      //   action: "delete_comment",
      //   feed_id: selectedComment.feeds,
      //   comment: selectedComment._id,
      //   token: localStorage.getItem("token"),
      //   action_response: result.action_response,
      //   creator_id: result.action_response.creator_id,
      // };
      // socket.emit("feed_room_action_event", socketData);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleMenu = (row) => {
    let MENU_OPTIONS = [];
    if (feeds_list.is_self) {
      MENU_OPTIONS.push({
        label: "Edit",
        icon: "akar-icons:edit",
        handleClick: handleFeedEdit,
      });
    }
    if (feeds_list.is_self || feeds_list.can_delete) {
      MENU_OPTIONS.push({
        label: "Delete",
        icon: "ant-design:delete-twotone",
        handleClick: handleAgreeDelete,
      });
    }
    return MENU_OPTIONS;
  };
  useEffect(() => {
    setIsLiked(feeds_list?.liked_by_me);
    setCommetMessage(feeds_list?.comments[0]);
    setTopLikedUser(feeds_list?.liked_by);
    setTopCoinedUser(feeds_list?.feed_points);
    setLikeCount(feeds_list?.liked_by?.length);
    setcoinsCount(feeds_list?.feed_points?.length);
    setCommentCount(feeds_list?.total_comments);
  }, [feeds_list]);
  useEffect(() => {
    if (showAllComments == false) {
      if (commetMessage?.child_comment?.length) {
        setTotalCommentCount(1 + commetMessage?.child_comment?.length);
      } else {
        setTotalCommentCount(1);
      }
    }
  }, [showAllComments, commetMessage]);

  return (
    <div className="profile-cards p-3 mb-3 main-section">
      <div className="d-flex w-100 justify-content-between">
        <UserInfoCard
          profile_image={s3baseUrl + feeds_list.created_by?.profile_image}
          user_name={htmlDecode(feeds_list.created_by?.name)}
          avatar_char={feeds_list.created_by?.name}
          date={feeds_list?.createdAt}
          activity_type={null}
          type={feeds_list.created_by?.user_type}
        />

        <div className="poster-logo text-end">
          <span className="d-flex feed-level">
            {(feeds_list.is_self || feeds_list.can_delete) && (
              <CustomPopover menu={handleMenu(feeds_list)} data={feeds_list} />
            )}
          </span>
        </div>
      </div>
      <div className="mt-2 post-description">
        <p
          onClick={() => handlePostDetail(feeds_list._id)}
          dangerouslySetInnerHTML={{
            __html: feeds_list.description,
          }}
        ></p>
      </div>
      {feeds_list.feed_type === "image" && feeds_list.images && (
        <div className="feed-image">
          <FeedImagesList
            feed_images={feeds_list.images}
            handleClickImage={handleClickImage}
          />
        </div>
      )}

      {feeds_list.feed_type === "video" &&
        feeds_list.video_url &&
        feeds_list.description === "" && (
          <div className="feed-image">
            <ReactVideoPlayer
              url={feeds_list.video_url}
              playingVideo={playingVideo}
            />
          </div>
        )}

      {feeds_list.feed_type === "video" &&
        feeds_list.video_url &&
        feeds_list.description !== "" && (
          <div className="feed-image">
            <ReactVideoPlayer url={feeds_list.video_url} />
          </div>
        )}

      <ActionsCount
        handleOpenLikedBox={handleOpenLikedBox}
        handleOpenCoinsBox={handleOpenCoinsBox}
        coinsCount={coinsCount}
        likeCount={likeCount}
        topLikedUser={topLikedUser}
        handleOpenGratitudeBox={handleOpenGratitudeBox}
        setcoinsCount={setcoinsCount}
        topCoinedUser={topCoinedUser}
      />
      <hr />
      <HandleAction
        isLiked={isLiked}
        handleFeedAction={handleFeedAction}
        setShowAddComment={setShowAddComment}
        showAddComment={showAddComment}
        feed_id={feeds_list._id}
        commentCount={commentCount}
      />

      <hr />
      <div className="profile-comments">
        {commentCount > 0 && (
          <>
            {feeds_list.is_show_all ? (
              <FeedComments
                feed_id={feeds_list._id}
                setTotalCommentCount={setTotalCommentCount}
              />
            ) : (
              <SingleComment
                comment={commetMessage}
                handleCommentEdit={handleCommentEdit}
                handleCommentDelete={handleCommentDelete}
                handleUpdateSpecificFeed={handleUpdateSpecificFeed}
                setShowAddComment={setShowAddComment}
                showAddComment={showAddComment}
                openDetailModal={openDetailModal}
                handlePostDetail={handlePostDetail}
              />
            )}
          </>
        )}
        {commentCount > 1 ? (
          <div className="d-flex justify-content-between">
            <div className="view-comment mt-2 me-3 date-color">
              {!feeds_list.is_show_all ? (
                // <span onClick={() => handleViewAllComments(true)}>
                <span onClick={() => handlePostDetail(feeds_list._id)}>
                  View more comments
                </span>
              ) : (
                <span onClick={() => handleViewAllComments(false)}>
                  View less comments
                </span>
              )}
            </div>
            {/* <div className="view-comment mt-2 me-3 date-color">
              {totalCommentCount} of {commentCount}
            </div> */}
          </div>
        ) : (
          ""
        )}
        {showAddComment && !feeds_list.is_show_all && (
          <AddComment
            post_id={feeds_list._id}
            get_date={call_on_comment}
            formAction={formAction}
            feedsData={feeds_list}
            setFormAction={setFormAction}
            setShowAddComment={setShowAddComment}
            handleUpdateSpecificFeed={handleUpdateSpecificFeed}
            commentSelected={commentSelected}
            setCommentSelected={setCommentSelected}
          />
        )}
      </div>
      {openLikesModal === true && (
        <ShowAllLikes
          openLikesModal={openLikesModal}
          setOpenLikesModal={setOpenLikesModal}
          handleCloseSimpleBox={handleCloseSimpleBox}
          showTab={showTab}
          post_id={feeds_list._id}
          feeds_list={feeds_list}
          feeds_type="general"
        />
      )}

      <CustomConfirmation
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title={"Are you sure you want to delete this post?"}
        handleAgree={handleAgree}
      />
      <CustomConfirmation
        openDelete={openDeleteComment}
        setOpenDelete={setOpenDeleteComment}
        title={"Are you sure you want to delete this comment?"}
        handleAgree={handleDelete}
      />
    </div>
  );
}

export default PostCard;
