import { Chip, IconButton, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import FeedImagesList from "src/components/CommunityFeed/FeedImagesList";

export default function PostDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log(state, "stateeeeeeeeeeeeeeeee");
  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-sm-12 d-flex">
          <h2>Post Detail</h2>
          <Typography
            sx={{ color: "#1a93a9", fontSize: "15px", marginLeft: "5px" }}
          >
            <Chip
              className="text-capital post-detail-chip"
              label={`${state?.created_for} Post `}
              color={"primary"}
            />
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="d-flex mt-0 mb-0">
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Post By:{" "}
            </Typography>
            <p className="ms-2">{` ${state?.created_by.name}`}</p>
          </div>
          {state?.publish_status === "rejected" && (
            <div className="d-flex mt-0 mb-0">
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                Rejected Reason:{" "}
              </Typography>
              <p className="ms-2">
                {state.rejection_reason ? state.rejection_reason : ""}
              </p>
            </div>
          )}
          <div
            className="mt-0"
            dangerouslySetInnerHTML={{
              __html: state?.description,
            }}
          ></div>

          <div className="mt-2 post-detail">
            {state.feed_type === "video" && state.video_url && (
              <div className="col-12 col-md-8 post-detail-image">
                <div>
                  <ReactVideoPlayer url={state.video_url} />
                </div>
              </div>
            )}
            {state.feed_type === "image" && state.image && (
              <div className="feed-image">
                <FeedImagesList
                  feed_images={state.image}
                  //   handleClickImage={handleClickImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
