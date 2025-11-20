import { Avatar, AvatarGroup } from "@mui/material";
import React from "react";
import { communityHeart } from "src/assets";
import { s3baseUrl } from "src/config/config";

export default function ActionsCount({
  handleOpenLikedBox,
  likeCount,
  topLikedUser,
  topCoinedUser,
  handleOpenCoinsBox,
  coinsCount,
}) {
  return (
    <div className="my-2 comment-icon d-flex justify-content-between clear-both">
      <div className="svg-color mt-1 comment-icons">
        <div
          className="likes-post d-flex ps-0 ps-md-2"
          onClick={handleOpenLikedBox}
        >
          {likeCount > 0 && (
            <>
              <img src={communityHeart} alt="" />
              &nbsp;
              <AvatarGroup max={2}>
                {topLikedUser &&
                  topLikedUser.map((liked_user, index) => {
                    return (
                      <Avatar
                        sx={{ width: 14, height: 14 }}
                        alt={liked_user.name}
                        src={s3baseUrl + liked_user.profile_image}
                        key={index}
                      />
                    );
                  })}
              </AvatarGroup>
              {/* {likeCount > 1 && <span>&nbsp;and {likeCount - 1} others</span>} */}
            </>
          )}
        </div>
      </div>
      {/* <>
        <div className="mt-1 likes-post">
          <div
            className="likes-post d-flex ps-0 ps-md-2"
            onClick={handleOpenCoinsBox}>
            {coinsCount > 0 && (
              <>
                &nbsp;
                <AvatarGroup max={2}>
                  {topCoinedUser &&
                    topCoinedUser.map((liked_user, index) => {
                      return (
                        <Avatar
                          sx={{ width: 14, height: 14 }}
                          alt={liked_user.sender.name}
                          src={s3baseUrl + liked_user.sender.profile_image}
                          key={index}
                        />
                      );
                    })}
                </AvatarGroup>
              </>
            )}
          </div>
        </div>
      </> */}
    </div>
  );
}
