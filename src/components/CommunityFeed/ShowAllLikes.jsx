import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import Modal from "@mui/material/Modal";
import { communityHandScreenshot, communityHeart } from "src/assets";
import { get_more_activity_list } from "src/DAL/CommunityArea/Community";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContentSetting } from "src/Hooks/ContentSettingState";
// import MUICustomTabs from "../MUICustomTabs";
import UsersList from "./UsersList";
import MUICustomTabs from "../GeneralComponents/MUICustomTabs";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "0%",
    marginTop: "20%",
    marginBottom: "20%",
  },
  resize: {
    fontSize: 20,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  minHeight: 380,
  maxHeight: 480,
  maxWidth: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  pt: 0,
  borderRadius: 1,
  overflow: "auto",
};

export default function ShowAllLikes({
  openLikesModal,
  handleCloseSimpleBox,
  showTab,
  post_id,
  feeds_type,
  feeds_list,
}) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(showTab);
  const [isLoading, setIsLoading] = useState(false);
  const [feedActivity, setFeedActivity] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMorePath, setLoadMorePath] = useState("");
  const [loadMore, setLoadMore] = useState(
    "api/feeds/feed_activity_detail?page=0&limit=10"
  );

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
    [isLoadingMore, totalPages, pageNumber, loadMorePath, observer]
  );

  //Changing tab values
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  console.log(feeds_list, "feeds_listfeeds_listfeeds_list");
  const getMoreActivityList = async (feed, load_path) => {
    const formData = new FormData();
    var action_type = "all";
    if (tabValue == 1) {
      action_type = "like";
    } else if (tabValue == 2) {
      action_type = "gratitude";
    }
    formData.append("feed", post_id);
    formData.append("action_type", action_type);

    const result = await get_more_activity_list(load_path, formData);
    if (result.code === 200) {
      var newArray = feed.concat(result.feed_activity);
      setFeedActivity(newArray);
      setPageNumber((page) => page + 1);
      setTotalPages(result.total_pages);
      setLoadMorePath(result.load_more);
      setIsLoadingMore(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsLoadingMore(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const loadMoreData = () => {
    //   setIsLoadingMore(true);
    // getMoreActivityList(feedActivity, loadMorePath);
  };

  useEffect(() => {
    setPageNumber(0);
    setTotalPages(0);
    // setIsLoading(true);
    // getMoreActivityList([], loadMore);
  }, [tabValue]);

  const TABS_OPTIONS = [
    {
      title: (
        <span className="d-flex likes-model-tabs">
          <img src={communityHeart} alt="" />
          Likes
        </span>
      ),
      component: isLoading ? (
        <CircularProgress className={classes.loading} color="primary" />
      ) : (
        <UsersList
          feedActivity={feeds_list?.liked_by}
          totalPages={totalPages}
          pageNumber={pageNumber}
          lastBookElementRef={lastBookElementRef}
          loadMoreData={loadMoreData}
          isLoadingMore={isLoadingMore}
        />
      ),
    },
  ];

  return (
    <div>
      <Modal
        open={openLikesModal}
        onClose={handleCloseSimpleBox}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div className="create-post-title-form">
          <Box sx={style} className="modal-theme show-all-likes-box">
            <span
              className="cross-show-all-likes-model"
              onClick={handleCloseSimpleBox}>
              x
            </span>
            <div className="text-center modalIcon clo-12 show-all-likes">
              <MUICustomTabs
                data={TABS_OPTIONS}
                value={tabValue}
                handleChange={handleChangeTab}
              />
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
