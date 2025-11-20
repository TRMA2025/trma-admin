import { invokeApi } from "../../../bl_libs/invokeApi";

export const addBusinessStrategy = async (data) => {
  const requestObj = {
    path: `/api/buisness_strategy/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const editBusinessStrategy = async (data, id) => {
  const requestObj = {
    path: `/api/buisness_strategy/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const deleteBusinessStrategy = async (id) => {
  const requestObj = {
    path: `/api/buisness_strategy/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const buisnessStrategyListApi = async (data, id) => {
  const requestObj = {
    path: `/api/buisness_strategy/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const buisnessStrategyDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/buisness_strategy/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
