import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  community_feed_action,
  delete_feed_action,
  get_feeds_detail,
} from "src/DAL/CommunityArea/Community";
import { Tooltip } from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";

import ShowAllLikes from "src/components/CommunityFeed/ShowAllLikes";

import FeedComments from "src/components/CommunityFeed/FeedComments";

import CreatePost from "./CreatePost";
import UserInfoCard from "src/components/CommunityFeed/UserInfoCard";
import ActionsCount from "src/components/CommunityFeed/ActionsCount";
import HandleAction from "src/components/CommunityFeed/HandleAction";
import FeedImageSlider from "src/components/CommunityFeed/FeedImageSlider";
import CustomPopover from "src/components/MenuOption/CustomPopover";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import { is_small_screen } from "src/utils/constant";
import { useContentSetting } from "src/Hooks/ContentSettingState";

export default function FeedDetailPopup({
  handleCloseDetailBox,
  post_id,
  feed,
  getFeedsListingOnAddFeed,
  handleSuccessDelete,
  handleSuccessUpdate,
  feeds_type,
  openDetailModal,
  selectedImageIndex,
  feedsList,
}) {
  const { userInfo, socket } = useContentSetting();

  const [showTab, setShowTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [feedDetail, setFeedDetail] = useState(feed);
  const [feedDetailComments, setFeedDetailComments] = useState([]);
  const [isLiked, setIsLiked] = useState(feed.liked_by_me);
  const [isGratituded, setIsGratituded] = useState(0);
  const [topLikedUser, setTopLikedUser] = useState(0);
  const [feedType, setFeedType] = useState(feed.feed_type);
  const [topGratitudeUser, setTopGratitudeUser] = useState(
    feed.top_gratitude_user
  );
  const [topCoinedUser, setTopCoinedUser] = useState(0);

  const [likeCount, setLikeCount] = useState(feed.liked_by?.length);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [formAction, setFormAction] = useState("EDIT");
  const [openCoinsModal, setOpenCoinsModal] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [feedId, setFeedId] = useState("");
  const [isShowMore, setIsShowMore] = useState(true);
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const [coinsCount, setCoinsCount] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openPin, setOpenPin] = useState(false);

  //Changing tab values
  const getFeedsDeteil = async () => {
    const result = await get_feeds_detail(post_id);
    if (result.code === 200) {
      setFeedDetail(result.feed);
      // setCoinsCount(result.feeds.coins_count);
      setIsLiked(result?.feed.liked_by_me);
      setCommentCount(result.feed.total_comments);
      setTopLikedUser(result?.feed.liked_by);
      setTopCoinedUser(result?.feed.feed_points);
      setLikeCount(result?.feed.liked_by?.length);
      setCoinsCount(result?.feed.feed_points?.length);
      // setTopGratitudeUser(result.feeds.top_gratitude_user);
      // setGratitudeCount(result.feeds.gratitude_count);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleOpenLikedBox = () => {
    setOpenLikesModal(true);
    setShowTab(0);
  };

  const handleOpenGratitudeBox = () => {
    setOpenLikesModal(true);
    setShowTab(2);
  };

  const handleCloseSimpleBox = () => {
    setOpenLikesModal(false);
    setShowTab();
  };
  const handleOpenCoinsBox = () => {
    setOpenCoinsModal(true);
    // setShowTab(0);
  };
  const handleCloseCoinBox = () => {
    setOpenCoinsModal(false);
    setShowTab();
  };
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
        getFeedsDeteil();
        getFeedsListingOnAddFeed(id);
        // setCoinsCount(result.action_response.coins_count);
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

  const handleFeedEdit = (selected_feed) => {
    setFormAction("EDIT");
    setOpenCreateModal(true);
  };

  const handleAgreePin = (value) => {
    setOpenPin(true);
  };

  const handleAgreeDelete = (value) => {
    setFeedId(value._id);
    setOpenDelete(true);
  };

  const handleAgree = async () => {
    setOpenDelete(false);
    const result = await delete_feed_action(feedId);
    if (result.code === 200) {
      enqueueSnackbar("Post deleted successfully", { variant: "success" });
      setOpenDelete(false);

      handleSuccessDelete(feed);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  let MENU_OPTIONS = [];

  if (feedDetail?.is_self) {
    MENU_OPTIONS.push({
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleFeedEdit,
    });
  }
  if (feedDetail?.is_self || feedDetail?.can_delete) {
    MENU_OPTIONS.push({
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    });
  }

  useEffect(() => {
    getFeedsDeteil();
  }, [post_id]);

  const getImages = (data) => {
    let galleryArray = [];
    let galleryObject = {};
    data.map((gallery, index) => {
      galleryObject = {
        original: s3baseUrl + gallery.thumbnail_1,
        thumbnail: s3baseUrl + gallery.thumbnail_1,
      };
      galleryArray.push(galleryObject);
    });
    // galleryObject = {
    //   original: s3baseUrl + data,
    //   thumbnail: s3baseUrl + data,
    // };
    // galleryArray.push(galleryObject);
    return galleryArray;
  };
  return (
    <>
      <div className="row post-detail-box p-4">
        {feedDetail?.feed_type === "general" ? (
          <div className="col-12 col-md-6 mt-5 mt-md-0 mx-auto profile-cards p-3 mb-3 main-section">
            <div className="d-flex w-100 justify-content-between">
              <UserInfoCard
                profile_image={
                  s3baseUrl + feedDetail?.created_by?.profile_image
                }
                user_name={htmlDecode(feedDetail?.created_by?.name)}
                avatar_char={feedDetail?.created_by?.name}
                date={feedDetail?.createdAt}
                activity_type={null}
                type={feedDetail?.created_by.user_type}
              />

              {
                <div className="poster-logo text-end">
                  {feeds_type == "general" ? (
                    <span className="d-flex feed-level">
                      {(feedDetail?.is_self || feedDetail?.can_delete) &&
                        MENU_OPTIONS.length > 0 && (
                          <CustomPopover
                            menu={MENU_OPTIONS}
                            data={feedDetail}
                          />
                        )}
                    </span>
                  ) : (
                    <span className="d-flex feed-level">
                      {(feedDetail?.is_self || feedDetail?.can_delete) &&
                        MENU_OPTIONS.length > 0 && (
                          <CustomPopover
                            menu={MENU_OPTIONS}
                            data={feedDetail}
                          />
                        )}
                    </span>
                  )}
                </div>
              }
            </div>

            <div className="mt-2 post-description">
              <p
                onClick={() => handlePostDetail(feedDetail?._id)}
                dangerouslySetInnerHTML={{
                  __html: feedDetail?.description,
                }}
              ></p>
            </div>

            <ActionsCount
              handleOpenLikedBox={handleOpenLikedBox}
              handleOpenCoinsBox={handleOpenCoinsBox}
              likeCount={likeCount}
              topLikedUser={topLikedUser}
              handleOpenGratitudeBox={handleOpenGratitudeBox}
              gratitudeCount={gratitudeCount}
              topGratitudeUser={topGratitudeUser}
              coinsCount={coinsCount}
              feeds_type={feeds_type}
              topCoinedUser={topCoinedUser}
            />
            <hr />
            <HandleAction
              isLiked={isLiked}
              handleFeedAction={handleFeedAction}
              feeds_type={feeds_type}
              setShowAddComment={() => {}}
              isGratituded={isGratituded}
              feed_id={post_id}
              commentCount={commentCount}
            />
            <hr />
            <FeedComments
              is_popup={openDetailModal}
              feed_id={post_id}
              getFeedsListingOnAddFeed={getFeedsListingOnAddFeed}
              setTotalCommentCount={setTotalCommentCount}
              feedsList={feedsList}
              feedDetail={feedDetail}
              getFeedsDeteil={getFeedsDeteil}
            />
          </div>
        ) : (
          <>
            {feedDetail.feed_type === "image" && feedDetail.images && (
              <div
                className="col-12 col-md-8 post-detail-image"
                style={{ margin: "auto" }}
              >
                <FeedImageSlider
                  data={getImages(feedDetail.images)}
                  selectedIndex={selectedImageIndex}
                />
              </div>
            )}
            {feedDetail?.feed_type === "video" && feedDetail?.video_url && (
              <div className="col-12 col-md-8 post-detail-image">
                {!is_small_screen() ? (
                  <div className="feed-video mx-5">
                    <ReactVideoPlayer
                      url={feedDetail?.video_url}
                      playingVideo={true}
                    />
                  </div>
                ) : (
                  <div className="mx-3 my-3">
                    <ReactVideoPlayer
                      url={feedDetail?.video_url}
                      playingVideo={true}
                    />
                  </div>
                )}
              </div>
            )}

            <div
              className={`col-12 col-md-4 profile-cards p-4 p-lg-3 mb-3 main-section mx-auto ${
                openDetailModal ? "popup-detail-box" : "detail-page-box"
              }`}
            >
              <div className="d-flex w-100 justify-content-between">
                <UserInfoCard
                  profile_image={
                    s3baseUrl + feedDetail?.created_by?.profile_image
                  }
                  user_name={htmlDecode(feedDetail?.created_by?.name)}
                  avatar_char={feedDetail?.created_by?.name}
                  date={feedDetail?.createdAt}
                  activity_type={null}
                  type={feedDetail?.created_by.user_type}
                />

                {(feedDetail?.is_self || feedDetail?.can_delete) &&
                  MENU_OPTIONS.length > 0 && (
                    <div className="poster-logo text-end">
                      <CustomPopover menu={MENU_OPTIONS} data={feedDetail} />
                    </div>
                  )}
              </div>
              <div className="mt-2 post-description">
                <p
                  onClick={() => handlePostDetail(feedDetail?._id)}
                  dangerouslySetInnerHTML={{
                    __html: feedDetail?.description,
                  }}
                ></p>
              </div>

              <ActionsCount
                handleOpenLikedBox={handleOpenLikedBox}
                likeCount={likeCount}
                topLikedUser={topLikedUser}
                handleOpenGratitudeBox={handleOpenGratitudeBox}
                gratitudeCount={gratitudeCount}
                topGratitudeUser={topGratitudeUser}
                coinsCount={coinsCount}
                feeds_type={feeds_type}
                topCoinedUser={topCoinedUser}
                handleOpenCoinsBox={handleOpenCoinsBox}
              />

              <hr />
              <HandleAction
                isLiked={isLiked}
                handleFeedAction={handleFeedAction}
                feeds_type={feeds_type}
                setShowAddComment={() => {}}
                isGratituded={isGratituded}
                feed_id={post_id}
                commentCount={commentCount}
              />

              <hr />
              <FeedComments
                is_popup={openDetailModal}
                feed_id={post_id}
                getFeedsListingOnAddFeed={getFeedsListingOnAddFeed}
                setTotalCommentCount={setTotalCommentCount}
                feedDetail={feedDetail}
                getFeedsDeteil={getFeedsDeteil}
              />
            </div>
          </>
        )}

        {openLikesModal && (
          <ShowAllLikes
            openLikesModal={openLikesModal}
            setOpenLikesModal={setOpenLikesModal}
            handleCloseSimpleBox={handleCloseSimpleBox}
            showTab={showTab}
            post_id={post_id}
            feeds_type={feeds_type}
            feeds_list={feedDetail}
          />
        )}

        <CustomConfirmation
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          title={"Are you sure you want to delete this post?"}
          handleAgree={handleAgree}
        />
      </div>

      {setOpenCreateModal && (
        <CreatePost
          setFeedType={setFeedType}
          feedType={feedType}
          openCreateModal={openCreateModal}
          setOpenCreateModal={setOpenCreateModal}
          getFeedsListing={getFeedsListingOnAddFeed}
          userInfo={userInfo}
          selectedFeed={feed}
          formAction={formAction}
          setFormAction={setFormAction}
          handleSuccessUpdate={handleSuccessUpdate}
          feeds_type={feeds_type}
          openDetailModal={openDetailModal}
        />
      )}
    </>
  );
}
