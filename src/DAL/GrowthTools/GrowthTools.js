import { invokeApi } from "src/bl_libs/invokeApi";

export const daily_message_list_api = async (page, limit) => {
  const requestObj = {
    path: `/api/daily_message`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const delete_daily_message_api = async (slug) => {
  const requestObj = {
    path: `/api/daily_message/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_daily_message_api = async (data) => {
  const requestObj = {
    path: `/api/daily_message`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_daily_message_api = async (data, slug) => {
  const requestObj = {
    path: `/api/daily_message/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const _add_automated_responded_message = async (data) => {
  const requestObj = {
    path: `/api/auto_responder_message`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const departmentListAPIs = async (data) => {
  const requestObj = {
    path: `/api/department/list_active_department`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const daily_message_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/daily_message/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// meditation
export const list_meditation = async () => {
  const requestObj = {
    path: `/api/meditation/get_all_meditation`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_meditation = async (data) => {
  const requestObj = {
    path: `/api/meditation/add_meditation`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_meditation = async (data, id) => {
  const requestObj = {
    path: `/api/meditation/update_meditation/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_meditation = async (id) => {
  const requestObj = {
    path: `/api/meditation/delete_meditation/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const meditation_detail_api = async (id) => {
  const requestObj = {
    path: `/api/meditation/detail_meditation/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

//affirmations
export const list_affirmation = async () => {
  const requestObj = {
    path: `/api/affirmation/affirmation_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_affirmation = async (data) => {
  const requestObj = {
    path: `/api/affirmation/add_affirmation`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_affirmation = async (data, id) => {
  const requestObj = {
    path: `/api/affirmation/update_affirmation/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_affirmation = async (id) => {
  const requestObj = {
    path: `/api/affirmation/delete_affirmation/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const affirmation_detail_api = async (id) => {
  const requestObj = {
    path: `/api/meditation/detail_meditation/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

//challenges
export const list_challenges = async () => {
  const requestObj = {
    path: `/api/challenges/get_all_challenges`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_challenges = async (data) => {
  const requestObj = {
    path: `/api/challenges/add_challenge`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_challenges = async (data, id) => {
  const requestObj = {
    path: `/api/challenges/update_challenge/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_challenges = async (id) => {
  const requestObj = {
    path: `/api/challenges/delete_challenge/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const challenges_detail_api = async (id) => {
  const requestObj = {
    path: `/api/challenges/detail_challenge/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_goal_settings = async (data) => {
  const requestObj = {
    path: `/api/content_setting/add_certificate_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
