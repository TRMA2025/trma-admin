import { invokeApi } from "../../../bl_libs/invokeApi";

export const dynamite_events_category_list_api = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category/dynamite_event_category_list_by_event/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_dynamite_event_category_api = async (data) => {
  const requestObj = {
    path: `/api/dynamite_event_category/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_dynamite_event_category_api = async (data, slug) => {
  const requestObj = {
    path: `/api/dynamite_event_category/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const delete_dynamite_event_category_api = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_active_dynamite_events_list = async () => {
  const requestObj = {
    path: `/api/dynamite_event/active_dynamite_event_list/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const getActiveDynamiteCategoriesList = async () => {
  const requestObj = {
    path: `/api/dynamite_event_category/active_dynamite_event_category_list/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const dynamite_event_category_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/dynamite_event_category/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
