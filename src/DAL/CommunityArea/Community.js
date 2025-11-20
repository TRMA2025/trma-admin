import { invokeApi } from "../../bl_libs/invokeApi";

export const communityListing = async (data) => {
  const requestObj = {
    path: `/api/rewards`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const editCommunityListing = async (data, id) => {
  const requestObj = {
    path: `/api/rewards/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addCommunityRewardApi = async (data) => {
  const requestObj = {
    path: `/api/rewards`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteCommunityRewardApi = async (id) => {
  const requestObj = {
    path: `/api/rewards/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const get_community_content = async (data) => {
  const requestObj = {
    path: `api/home`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_feed_activity_list = async (data) => {
  const requestObj = {
    path: `api/feeds/feed_activity_detail?page=0&limit=1`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_more_activity_list = async (path, data) => {
  const requestObj = {
    path: path,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_more_event_comment_likes = async (path) => {
  const requestObj = {
    path: path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_feeds_list = async (loadMore) => {
  const requestObj = {
    path: `/${loadMore}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_series_video_detail = async (video_id) => {
  const requestObj = {
    path: `api/series_videos/${video_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_event_video_detail = async (video_id) => {
  const requestObj = {
    path: `api/dynamite_event_category_video/by_slug/${video_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_feeds_detail = async (feed_id) => {
  const requestObj = {
    path: `/api/feed/feed_detail/${feed_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const favourite_videos_list = async () => {
  const requestObj = {
    path: `api/series_videos/list_favorite`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const set_favourite_video = async (data) => {
  const requestObj = {
    path: `api/series_videos/favorite_unfavorite`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const add_new_feed = async (data) => {
  const requestObj = {
    path: `/api/feed/add_feed`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_feed = async (data, feed_id) => {
  const requestObj = {
    path: `/api/feed/update_feed/${feed_id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const approveRejectPost = async (data, feed_id) => {
  const requestObj = {
    path: `/api/feed/approve_reject_feed/${feed_id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const community_feed_action = async (id) => {
  const requestObj = {
    path: `/api/feed/like_unlike_feed/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
export const community_feed_action_for_comments = async (id) => {
  const requestObj = {
    path: `/api/feed_comment/like_unlike_comment/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const delete_feed_action = async (feed_id) => {
  const requestObj = {
    path: `/api/feed/delete_feed/${feed_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const pin_feed_action = async (data) => {
  const requestObj = {
    path: `api/feeds/status_action/client`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_token_for_a_video_stream = async (id) => {
  const requestObj = {
    path: `api/feeds/member/join/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const update_feed_image_on_s3 = async (data) => {
  const requestObj = {
    path: `app/feed/update_image_on_s3`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const get_my_feeds_list = async (loadMore) => {
  const requestObj = {
    path: `/${loadMore}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const uploadMultipleFeedImageOns3 = async (data) => {
  const requestObj = {
    path: `/app/upload_image`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
