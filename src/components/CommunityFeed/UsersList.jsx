import React from "react";
import { s3baseUrl } from "src/config/config";
import UserInfoCard from "./UserInfoCard";

export default function UsersList({
  feedActivity,
  totalPages,
  pageNumber,
  lastBookElementRef,
  loadMoreData,
  isLoadingMore,
}) {
  return (
    <div className="row feed-activity-box">
      {feedActivity.map((activity, index) => {
        return (
          <div className="col-12 mt-3" key={index}>
            <UserInfoCard
              profile_image={s3baseUrl + activity?.profile_image}
              user_name={activity?.name}
              avatar_char={activity?.name}
              // date={activity?.createdAt}
              activity_type="like"
              type={activity?.user_type}
            />
          </div>
        );
      })}
      {totalPages > pageNumber ? (
        <div className="col-12 text-center">
          <span
            onClick={loadMoreData}
            className="load-more-text"
            ref={lastBookElementRef}>
            {isLoadingMore ? "Loading..." : "Load More"}
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
