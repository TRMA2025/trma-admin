import { invokeApi } from "../../bl_libs/invokeApi";

export const StripeListApi = async (page, limit, data) => {
  console.log(data, "in api call");
  const requestObj = {
    path: `/api/product?page=${page}&limit=${limit}&search=${data.search}&id=${
      data.id == undefined ? "" : data.id
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddStripeListApi = async (data) => {
  const requestObj = {
    path: `/api/product`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditStripeListApi = async (data, id) => {
  const requestObj = {
    path: `/api/product/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteStripeListApi = async (id) => {
  console.log(id, "ididididididididididididid");
  const requestObj = {
    path: `/api/product/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
