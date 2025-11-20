import { invokeApi } from "../../../bl_libs/invokeApi";

export const general_events_list_api = async (dynamite_event_id) => {
  const requestObj = {
    path: `/api/home_event?type=event&event=${dynamite_event_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_general_event_api = async (data) => {
  const requestObj = {
    path: `/api/home_event/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_general_event_api = async (data, slug) => {
  const requestObj = {
    path: `/api/home_event/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const general_event_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/home_event/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const delete_general_event_api = async (id) => {
  const requestObj = {
    path: `/api/home_event/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
