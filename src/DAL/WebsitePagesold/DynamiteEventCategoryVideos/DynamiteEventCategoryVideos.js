import { invokeApi } from "../../../bl_libs/invokeApi";

export const add_dynamite_event_category_video = async (data) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const editDynamiteEventCategoryVideo = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const deleteDynamiteEventCategoryVideo = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsCategoryVideoListApi = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/dynamite_event_category_video_list_by_category/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsCategoryVideoDetailApi = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
