import { invokeApi } from "../../bl_libs/invokeApi";

export const dynamite_events_list_api = async (
  page,
  rowsPerPage,
  searchText
) => {
  const requestObj = {
    path: `/api/dynamite_event?page=${page}&limit=${rowsPerPage}&search_text=${searchText}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_dynamite_event_api = async (data) => {
  const requestObj = {
    path: `/api/dynamite_event/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_dynamite_lock_content_event_api = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event/update/lock_configration/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_event_config_api = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event/update/event_timer_configration/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const add_dynamite_event_start_expiry_api = async (data) => {
  const requestObj = {
    path: `/api/dynamite_event/edit_dynamite_event_start_or_expiry_date`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_dynamite_event_api = async (data, slug) => {
  const requestObj = {
    path: `/api/dynamite_event/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamite_event_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/dynamite_event/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const delete_dynamite_event_api = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event/${id}`,
    method: "DELETE",
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
