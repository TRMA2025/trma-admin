import { invokeApi } from "../../bl_libs/invokeApi";
export const paymentPlansListBySalePageApi = async (id) => {
  const requestObj = {
    path: `/api/payment_plan/list_payment_plan_by_sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const paymentPlansListApi = async (data) => {
  const requestObj = {
    path: `/api/payment_plan/list_payment_plan`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const detailPaymentPlanApi = async (id) => {
  const requestObj = {
    path: `/api/payment_plan/detail_payment_plan/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const editPaymentPlanApi = async (data, id) => {
  const requestObj = {
    path: `/api/payment_plan/edit_payment_plan/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addPaymentPlanApi = async (data) => {
  const requestObj = {
    path: `/api/payment_plan/add_payment_plan`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deletePaymentPlanApi = async (id) => {
  const requestObj = {
    path: `/api/payment_plan/delete_payment_plan/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
