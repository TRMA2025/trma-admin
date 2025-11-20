import { invokeApi } from "../../bl_libs/invokeApi";

export const teamListSalePageApi = async (id) => {
  const requestObj = {
    path: `/api/team/sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const bannerSliderListApi = async (id) => {
  let api_path = `/api/slider/`;
  if (id) {
    api_path = `/api/slider/slider_by_sale_page/${id}`;
  }
  const requestObj = {
    path: api_path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addBannerApi = async (data) => {
  const requestObj = {
    path: `/api/slider`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editBannerApi = async (data, id) => {
  const requestObj = {
    path: `/api/slider/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteBannerApi = async (id) => {
  const requestObj = {
    path: `/api/slider/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
