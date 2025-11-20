import { invokeApi } from "../../bl_libs/invokeApi";

export const seriesVideosListing = async (data) => {
  const requestObj = {
    path: `/api/series_videos`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const editSeriesVideosApi = async (data, id) => {
  const requestObj = {
    path: `/api/series_videos/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addSeriesVideosApi = async (data) => {
  const requestObj = {
    path: `/api/series_videos`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteSeriesVideosApi = async (id) => {
  const requestObj = {
    path: `/api/series_videos/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
