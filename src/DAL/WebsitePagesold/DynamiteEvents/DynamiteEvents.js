import { invokeApi } from "../../../bl_libs/invokeApi";

export const addDynamiteEvents = async (data) => {
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

export const dynamiteEventsMembersDetailApi = async (data) => {
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

export const editDynamiteEvents = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event/${id}`,
    method: "PUT",
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

export const deleteDynamiteEvents = async (id) => {
  const requestObj = {
    path: `/api/dynamite_event/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsListApi = async (data, id) => {
  const requestObj = {
    path: `/api/dynamite_event/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/dynamite_event/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const dynamiteEventsMembersApi = async (
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
//   const requestObj = {
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     // postData: data,
//   };
//   return invokeApi(requestObj);
// };
