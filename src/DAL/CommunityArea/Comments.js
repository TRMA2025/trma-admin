import { invokeApi } from "../../bl_libs/invokeApi";

export const add_feed_comment = async (data) => {
  const requestObj = {
    path: `/api/feed_comment/add_feed_comment`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const edit_feed_comment = async (data, comment_id) => {
  const requestObj = {
    path: `/api/feed_comment/update_feed_comment/${comment_id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_feeds_commnets = async (loadMore, data) => {
  const requestObj = {
    path: loadMore,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const delete_comment_api = async (comment_id) => {
  const requestObj = {
    path: `/api/feed_comment/delete_feed_comment/${comment_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const comment_detail_api = async (comment_id) => {
  const requestObj = {
    path: `api/comment/${comment_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const user_pending_feed_list = async (status) => {
  const requestObj = {
    path: `/api/feed/feed_list/for_admin?publish_status=${status}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
