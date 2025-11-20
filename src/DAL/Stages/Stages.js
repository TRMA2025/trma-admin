import { invokeApi } from "src/bl_libs/invokeApi";
//Resources
export const list_stages = async (id) => {
  const requestObj = {
    path: `/api/stage/list/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_stage = async (data) => {
  const requestObj = {
    path: `/api/stage`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_stage = async (data, id) => {
  const requestObj = {
    path: `/api/stage/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const delete_stage = async (id) => {
  const requestObj = {
    path: `/api/stage/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const detail_stage = async (id) => {
  const requestObj = {
    path: `/api/challenges_resources/detail_challenge_resources/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
