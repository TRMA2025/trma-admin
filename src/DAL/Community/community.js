import { invokeApi } from "../../bl_libs/invokeApi";

export const communityListing = async (data) => {
  const requestObj = {
    path: `/api/rewards`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const editCommunityListing = async (data, id) => {
  const requestObj = {
    path: `/api/rewards/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addCommunityRewardApi = async (data) => {
  const requestObj = {
    path: `/api/rewards`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteCommunityRewardApi = async (id) => {
  const requestObj = {
    path: `/api/rewards/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
