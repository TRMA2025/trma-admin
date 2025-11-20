import { invokeApi } from "../../bl_libs/invokeApi";

export const eventListApi = async (slug) => {
  const requestObj = {
    path: `/api/event/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addEventApi = async (data) => {
  const requestObj = {
    path: `/api/event/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editEventApi = async (data, slug) => {
  const requestObj = {
    path: `/api/event/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteEventApi = async (slug) => {
  const requestObj = {
    path: `/api/event/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const eventDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/event/detail/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_new_event_api = async (data) => {
  const requestObj = {
    path: `/api/event/add/by_admin`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_event_api = async (data) => {
  const requestObj = {
    path: `/api/event/delete`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_member_event_api = async (data, event_slug) => {
  const requestObj = {
    path: `/api/event/update/by_admin/${event_slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const new_event_list_api = async (data) => {
  const requestObj = {
    path: `/api/event/list`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_event_iteration_api = async (data, event_slug) => {
  const requestObj = {
    path: `/api/event/event_iteration/update/${event_slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
