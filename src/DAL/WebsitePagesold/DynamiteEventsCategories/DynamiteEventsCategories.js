import { invokeApi } from "../../../bl_libs/invokeApi";

export const addDynamiteEventCategory = async (data) => {
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

export const editDynamiteEventCategory = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event_category/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const deleteDynamiteEventCategory = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const get_live_dynamite_event_another_member = async (
  event_id,
  text
) => {
  const requestObj = {
    path: `/api/member/get_live_dynamite_event_another_member/${event_id}?search_text=${text}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsCategoryListApi = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event_category/dynamite_event_category_list_by_event/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const getActiveDynamiteEventsList = async () => {
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

export const dynamiteEventsCategoryDetailApi = async (slug) => {
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
