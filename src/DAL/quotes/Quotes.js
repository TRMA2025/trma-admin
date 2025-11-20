import { invokeApi } from "../../bl_libs/invokeApi";
export const quotesListing = async (data) => {
  const requestObj = {
    path: `/api/quotation`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteQuotes = async (id) => {
  const requestObj = {
    path: `/api/quotation/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addQuotesApi = async (data) => {
  const requestObj = {
    path: `/api/quotation`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editQuotesApi = async (data, id) => {
  const requestObj = {
    path: `/api/quotation/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
