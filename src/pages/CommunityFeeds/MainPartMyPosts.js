import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  get_feeds_detail,
  get_feeds_list,
  get_my_feeds_list,
} from "src/DAL/CommunityArea/Community";
import CreatePost from "./CreatePost";
import OpenCreatePostCard from "./OpenCreatePostCard";
import PostCard from "./PostCard";
import { CircularProgress, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FeedDetailPopup from "./FeedDetailPopup";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "45%",
    marginTop: "20%",
    marginBottom: "20%",
  },
}));

function MainPartMyPosts({ showInfoBox, setShowInfoBox, userInfo }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [pageNumber, setPageNumber] = useState(0);
  const [totlePages, setTotlePages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [feedsList, setFeedsList] = useState([]);
  const [loadMorePath, setLoadMorePath] = useState("");
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [feedType, setFeedType] = useState("general");
  const [formAction, setFormAction] = useState("ADD");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState({});
  const [loadMore, setLoadMore] = useState(
    // `api/feed/group/feed_list?limit=50&page=0`
    // `api/feed/list_feed?page=0&limit=10`
    `api/feed/list_feed?page=0&limit=10`
  );
  // popup states
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && totlePages > pageNumber) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, totlePages, pageNumber, loadMorePath, observer]
  );

  const handleCloseDetailBox = () => {
    setOpenDetailModal(false);
  };

  const handleShowDetails = (post) => {
    setSelectedPost(post);
    setOpenDetailModal(true);
  };

  const handleSelectedImage = (post, index) => {
    setSelectedIndex(index);
    setSelectedPost(post);
    setOpenDetailModal(true);
  };

  const handleOpenImageBox = () => {
    setOpenCreateModal(true);
    setFeedType("image");
  };
  const handleOpenVideoBox = () => {
    setOpenCreateModal(true);
    setFeedType("video");
  };

  const handleSuccessDelete = (post) => {
    setOpenDetailModal(false);
    const updated_feed = feedsList.filter((feed) => feed._id !== post._id);
    setFeedsList(updated_feed);
  };

  const handleSuccessUpdate = async (post) => {
    handleUpdateSpecificFeed(post._id);
    setOpenDetailModal(false);
  };

  const handleUpdateSpecificFeed = async (id) => {
    const result = await get_feeds_detail(id);

    if (result.code === 200) {
      const data = feedsList.map((feed) => {
        if (feed._id === id) {
          return { ...result.feed, comments: result.feed.comments };
        } else {
          return feed;
        }
      });
      setFeedsList(data);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleUpdateShowAll = async (id, val) => {
    const data = feedsList.map((feed) => {
      if (feed._id === id) {
        return { ...feed, is_show_all: val };
      } else {
        return feed;
      }
    });
    setFeedsList(data);
  };
  // -----------------------------------
  const getFeedsListing = async () => {
    const result = await get_my_feeds_list(loadMore);
    console.log(result, "result of Feeds");
    if (result.code === 200) {
      const new_feeds = result.feeds.map((feed) => {
        return { ...feed, is_show_all: false };
      });
      var newArray = feedsList.concat(new_feeds);
      setFeedsList(newArray);
      setPageNumber(pageNumber + 1);
      setTotlePages(result.total_pages);
      setLoadMorePath(result.load_more);
      setIsLoadingMore(false);
      setIsLoadingSection(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingSection(false);
      setIsLoadingMore(false);
    }
  };

  const getFeedsListingOnAddFeed = async (path) => {
    setIsLoadingSection(true);
    const result = await get_my_feeds_list(path);
    if (result.code === 200) {
      setFeedsList(result.feeds);
      setPageNumber(0);
      setTotlePages(result.total_pages);
      setLoadMorePath(result.load_more);
      setIsLoadingMore(false);
      setIsLoadingSection(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingMore(false);
      setIsLoadingSection(false);
    }
  };

  const getFeedsListingOnDelete = async (id) => {
    const data = feedsList.filter((feed) => feed._id !== id);
    setFeedsList(data);
  };

  const loadMoreData = () => {
    setLoadMore(loadMorePath);
    setIsLoadingMore(true);
    // getFeedsListing(loadMorePath);
  };

  const handleOpenSimpleBox = () => {
    setOpenCreateModal(true);
    setFeedType("general");
  };

  const handleFeedEdit = (selected_feed) => {
    setSelectedFeed(selected_feed);
    setOpenCreateModal(true);
    setFormAction("EDIT");
  };

  useEffect(() => {
    getFeedsListing();
  }, [loadMore]);

  return (
    <>
      <OpenCreatePostCard
        handleOpenSimpleBox={handleOpenSimpleBox}
        userInfo={userInfo}
        handleOpenImageBox={handleOpenImageBox}
        handleOpenVideoBox={handleOpenVideoBox}
      />
      {isLoadingSection ? (
        <CircularProgress className={classes.loading} color="primary" />
      ) : (
        feedsList &&
        feedsList.map((feeds_list, index) => {
          return (
            <PostCard
              showInfoBox={showInfoBox}
              setShowInfoBox={setShowInfoBox}
              feeds_list={feeds_list}
              index={index}
              userInfo={userInfo}
              getFeedsListingOnDelete={getFeedsListingOnDelete}
              handleShowDetails={handleShowDetails}
              handleFeedEdit={handleFeedEdit}
              getFeedsListingOnAddFeed={getFeedsListingOnAddFeed}
              handleUpdateSpecificFeed={handleUpdateSpecificFeed}
              handleUpdateShowAll={handleUpdateShowAll}
              key={index}
              handleSelectedImage={handleSelectedImage}
              openDetailModal={openDetailModal}
            />
          );
        })
      )}

      {!isLoadingSection && totlePages > pageNumber ? (
        <div className="col-12 text-center favourite-buttton-box">
          <button
            ref={lastBookElementRef}
            className="small-contained-button mt-3"
            onClick={loadMoreData}
            id="load-more-feed">
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : (
        ""
      )}

      <CreatePost
        setFeedType={setFeedType}
        feedType={feedType}
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        getFeedsListing={getFeedsListingOnAddFeed}
        userInfo={userInfo}
        selectedFeed={selectedFeed}
        formAction={formAction}
        setFormAction={setFormAction}
        handleSuccessUpdate={handleSuccessUpdate}
        openDetailModal={openDetailModal}
      />

      <Modal
        open={openDetailModal}
        onClose={handleCloseDetailBox}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="feed-detail-popup">
        <>
          <div className="row post-detail-box">
            <span
              className="cross-show-all-likes-model"
              onClick={handleCloseDetailBox}>
              x
            </span>
          </div>
          <FeedDetailPopup
            handleCloseDetailBox={handleCloseDetailBox}
            post_id={selectedPost._id}
            feed={selectedPost}
            getFeedsListingOnAddFeed={handleUpdateSpecificFeed}
            handleSuccessDelete={handleSuccessDelete}
            handleSuccessUpdate={handleSuccessUpdate}
            feeds_type="general"
            // event_id={event_id}
            openDetailModal={openDetailModal}
            // feedSetting={feedSetting}
            selectedImageIndex={selectedIndex}
            feedsList={feedsList}
          />
        </>
      </Modal>
    </>
  );
}

export default MainPartMyPosts;
