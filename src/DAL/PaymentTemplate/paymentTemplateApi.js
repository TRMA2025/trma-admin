import { invokeApi } from "../../bl_libs/invokeApi";

export const paymentTemplateDetailApi = async (id) => {
  const requestObj = {
    path: `/api/payment_template/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const paymentTemplateListApiPagination = async (page, limit, data) => {
  console.log(data, "datatata");
  const requestObj = {
    path: `/api/payment_template?page=${page}&limit=${limit}&search=${
      data.search
    }&id=${data.id == undefined ? "" : data.id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddPaymentTemplateApi = async (data) => {
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
export const EditPaymentTemplateApi = async (data, id) => {
  const requestObj = {
    path: `/api/payment_template/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const DeletePaymentTemplateApi = async (id) => {
  const requestObj = {
    path: `/api/payment_template/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
