import { invokeApi } from "../../../../bl_libs/invokeApi";

export const add_dynamite_event_video_api = async (data) => {
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

export const update_dynamite_event_video_api = async (data, id) => {
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

export const delete_dynamite_event_video_api = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const dynamite_event_category_videos_api = async (id) => {
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

export const dynamite_event_video_detail_api = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category_video/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const update_question_configration = async (data, slug) => {
  const requestObj = {
    path: `/api/dynamite_event/question_configration/update/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
