import { Avatar } from "@mui/material";
import React from "react";
import { s3baseUrl } from "src/config/config";

export default function GuestUserInfo({ data }) {
  return (
    <>
      {data.map((user) => {
        return (
          <>
            <div className="post-creator user-info-card mt-2">
              <div className="like-profile-image">
                <Avatar src={s3baseUrl + user.profile_image} alt="photoURL">
                  {user.first_name[0]}
                </Avatar>
              </div>
              <div className="creator-name ps-2 pt-1 text-start">
                <span className="d-flex feed-level">
                  <h3 className="mb-0">
                    {user.first_name + " " + user.last_name}
                  </h3>
                </span>
                <span className="date-color">{user.email}</span>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}
