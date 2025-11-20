import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

import FeedDetailPopup from "./FeedDetailPopup";
import { get_feeds_detail } from "src/DAL/CommunityArea/Community";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

function PostDetails({ feeds_type }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const params = useParams();
  const [feedDetail, setFeedDetail] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getFeedsDeteil = async () => {
    setIsLoading(true);
    const result = await get_feeds_detail(params.post_id);
    if (result.code === 200) {
      setFeedDetail(result.feeds);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      navigate(`/community-news-feed`);
      setIsLoading(false);
    }
  };

  const handleSuccessDelete = (post) => {
    navigate(`/community-news-feed`);
    // getFeedsDeteil();
  };

  const handleSuccessUpdate = (post) => {
    setIsLoading(true);
    getFeedsDeteil();
  };

  const handleCloseDetailBox = () => {
    navigate("/community-news-feed");
  };

  const handleChangePage = () => {
    if (!params.event_id) {
      navigate(`/community-news-feed`);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    getFeedsDeteil();
    window.scroll(0, 0);
  }, [params.post_id]);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <IconButton className="back-screen-button" onClick={handleChangePage}>
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <FeedDetailPopup
        handleCloseDetailBox={handleCloseDetailBox}
        post_id={params.post_id}
        feed={feedDetail}
        getFeedsListingOnAddFeed={getFeedsDeteil}
        handleSuccessDelete={handleSuccessDelete}
        handleSuccessUpdate={handleSuccessUpdate}
        feeds_type="general"
        // event_id={params.event_id}
        selectedImageIndex={0}
        fromNotifications={true}
      />
    </>
  );
}

export default PostDetails;
