import React from "react";
import Chip from "@mui/material/Chip";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import { s3baseUrl } from "src/config/config";
import { Avatar } from "@mui/material";
import { string_avatar } from "src/utils/constant";
import LiveTvIcon from "@mui/icons-material/LiveTv";

function OpenCreatePostCard({
  handleOpenSimpleBox,
  setFeedType,
  userInfo,
  handleOpenImageBox,
  handleOpenVideoBox,
}) {
  return (
    <div className="open-create-post-card mb-2 mt-3 mt-lg-0">
      <div className="profile-cards p-3 community-card-title wealth-wallet">
        <div className="input-with-profile d-flex">
          <Avatar src={s3baseUrl + userInfo?.image?.thumbnail_1} alt="photoURL">
            {userInfo?.name}
          </Avatar>
          <div className="input-field ms-2" onClick={handleOpenSimpleBox}>
            What's on your mind ?
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-12 col-md-4  mt-3 mt-md-0">
            <div className="upload-video">
              <Chip
                onClick={handleOpenVideoBox}
                label={
                  <>
                    Upload Video
                    <VideocamIcon />
                  </>
                }
                variant="outlined"
              />
            </div>
          </div>
          <div className="col-12 col-md-4  mt-3 mt-md-0">
            <div className="upload-video">
              <Chip
                onClick={handleOpenImageBox}
                label={
                  <>
                    Upload Image
                    <PhotoCameraIcon />
                  </>
                }
                variant="outlined"
              />
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  );
}

export default OpenCreatePostCard;
