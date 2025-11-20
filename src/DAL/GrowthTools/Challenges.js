import { invokeApi } from "src/bl_libs/invokeApi";
//Resources
export const list_challenge_resources = async (id) => {
  const requestObj = {
    path: `/api/challenges_resources/get_all_challenge_resources/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_challenges_resources = async (data) => {
  const requestObj = {
    path: `/api/challenges_resources/add_challenge_resources`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_challenges_resources = async (data, id) => {
  const requestObj = {
    path: `/api/challenges_resources/update_challenge_resources/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_challenges_resources = async (id) => {
  const requestObj = {
    path: `/api/challenges_resources/delete_challenge_resources/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const challenges_resource_detail_api = async (id) => {
  const requestObj = {
    path: `/api/challenges_resources/detail_challenge_resources/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

//recordings
export const list_challenge_recordings = async (id) => {
  const requestObj = {
    path: `/api/challenge_recording/get_all_challenge_recording/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_challenges_recordings = async (data) => {
  const requestObj = {
    path: `/api/challenge_recording/add_challenge_recording`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_challenges_recordings = async (data, id) => {
  const requestObj = {
    path: `/api/challenge_recording/update_challenge_recording/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_challenges_recordings = async (id) => {
  const requestObj = {
    path: `/api/challenge_recording/delete_challenge_recording/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const challenges_recordings_detail_api = async (id) => {
  const requestObj = {
    path: `/api/challenge_recording/detail_challenge_recording/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
