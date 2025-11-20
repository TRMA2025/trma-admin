import { invokeApi } from "../../../bl_libs/invokeApi";

export const delete_dynamite_event_member = async (data) => {
  const requestObj = {
    path: `/api/member/delete_dynamite_event_member/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const add_dynamite_event_member = async (data) => {
  const requestObj = {
    path: `/api/member/add_dynamite_event_member/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const edit_dynamite_event_member = async (data) => {
  const requestObj = {
    path: `/api/member/edit_dynamite_event_member/`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamite_events_members_api = async (
  event_id,
  page,
  limit,
  search
) => {
  const requestObj = {
    path: `/api/member/get_live_dynamite_event_member_by_pagination/${event_id}?search_text=${search}&page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamite_events_member_detail_api = async (data) => {
  const requestObj = {
    path: `/api/member/get_live_dynamite_event_member_detail/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
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
