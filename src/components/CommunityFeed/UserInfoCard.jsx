import { Avatar, Chip } from "@mui/material";
import moment from "moment";
import React from "react";
import { communityHeart } from "src/assets";
import { get_date_of_user_time_zone } from "src/utils/constant";
import { useContentSetting } from "src/Hooks/ContentSettingState";

export default function UserInfoCard({
  profile_image,
  user_name,
  date,
  activity_type,
  avatar_char,
  type,
  fromCoins,
  activity,
}) {
  // const { userInfo, adminTimeZone } = useContentSetting();
  const userInfo = useContentSetting();

  return (
    <>
      <div className="post-creator user-info-card">
        <div className="like-profile-image">
          <Avatar src={profile_image} alt="photoURL">
            {avatar_char}
          </Avatar>
          {(activity_type === "like" || activity_type === "gratitude") && (
            <div className="tiny-like-icon">
              {activity_type === "like" ? (
                <img src={communityHeart} alt="" />
              ) : (
                <img src={communityHeart} alt="" />
              )}
            </div>
          )}
        </div>
        <div className="creator-name ps-2 pt-1 text-start">
          <span className="d-flex feed-level post-by">
            <h3 className="mb-0 user-name">{user_name}</h3>
            {type != "member_user" && (
              <Chip
                label={type == "admin_user" ? "Admin" : "Coach"}
                color="primary"
              />
            )}
          </span>
          {fromCoins && (
            <>
              <div className="d-flex">
                <span
                  style={{
                    // marginLeft: "30px",
                    color: "#f6bd4b",
                    fontWeight: 600,
                  }}
                >
                  Shared Coins:
                </span>
                <span
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  {" "}
                  {activity?.points_earned}
                </span>
              </div>
              <div className="d-flex">
                {" "}
                <span
                  style={{
                    color: "#f6bd4b",
                    fontWeight: 600,
                  }}
                >
                  Comment:
                </span>
                <span
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  {activity?.description}
                </span>
                <br />
              </div>
            </>
          )}
          {date && (
            <span className="date-color">
              {moment(date).format("DD MMM YYYY [at] hh:mm A")}
              {/* {get_date_of_user_time_zone(
              date,
              "DD MMM YYYY [at] hh:mm A",
              userInfo?.userInfo?.time_zone
            )} */}
              {/* 12 February 2023 at 12:30 PM */}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
