import { invokeApi } from "../../bl_libs/invokeApi";

export const paymentRequestListApi = async (page, limit, data) => {
  const requestObj = {
    path: `/api/payment_request/all_payment_request_list?page=${page}&limit=${limit}&search=${
      data.search
    }&id=${data.id == undefined ? "" : data.id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddPaymentRequestApi = async (data) => {
  const requestObj = {
    path: `/api/payment_template`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditPaymentRequestApi = async (data, id) => {
  const requestObj = {
    path: `/api/payment_request/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const DeletePaymentRequestApi = async (id) => {
  const requestObj = {
    path: `/api/payment_request/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
