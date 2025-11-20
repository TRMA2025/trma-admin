import { invokeApi } from "../../bl_libs/invokeApi";

export const feedsListing = async (page, limit) => {
  const requestObj = {
    path: `/api/feeds/list_with_pagination_for_admin?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// export const feedsListing = async (data) => {
//   const requestObj = {
//     path: `/api/feeds`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
export const editFeeds = async (data, id) => {
  const requestObj = {
    path: `/api/feeds/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const feedFeatureApi = async (data) => {
  const requestObj = {
    path: `/api/feeds/status_action`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addFeedApi = async (data) => {
  const requestObj = {
    path: `/api/feeds`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteFeedApi = async (id) => {
  const requestObj = {
    path: `/api/feeds/delete_feeds_for_admin/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
export const feedSettingApi = async () => {
  const requestObj = {
    path: `/api/feeds/setting`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
export const updateSettingApi = async (data) => {
  const requestObj = {
    path: `/api/feeds/setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
