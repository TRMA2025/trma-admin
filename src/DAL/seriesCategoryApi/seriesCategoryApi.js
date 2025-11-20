import { invokeApi } from "../../bl_libs/invokeApi";

export const seriesCategoryListing = async (data) => {
  const requestObj = {
    path: `/api/series_category`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addSeriesCategoryApi = async (data) => {
  const requestObj = {
    path: `/api/series_category`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteSeriesCategoryApi = async (id) => {
  const requestObj = {
    path: `/api/series_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
export const editSeriesCategoryApi = async (data, id) => {
  const requestObj = {
    path: `/api/series_category/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
