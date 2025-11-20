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
export const paymentPlansListApi = async (id) => {
  let api_path = `/api/payment_plan/list_payment_plan`;
  if (id) {
    api_path = `/api/payment_plan/list_payment_plan_by_sale_page/${id}`;
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
export const member_listing_by_page_plan = async (
  page,
  limit,
  search,
  data
) => {
  const requestObj = {
    path: `/api/event_subscriber/list_subscriber_with/plan_id/page_id?page=${page}&limit=${limit}&search_text=${
      search == undefined || search == "" ? "" : search
    }`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const programme_list_with_plan_api = async (plan_id) => {
  const requestObj = {
    path: `/api/payment_plan/get_client_programs_for_plan/${
      plan_id ? plan_id : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const update_porgrams_for_plan_api = async (plan_id, data) => {
  const requestObj = {
    path: `/api/payment_plan/update_porgrams_for_plan/${plan_id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const get_protal_list_for_plan_api = async (plan_id) => {
  const requestObj = {
    path: `/api/payment_plan/get_portal_list_for_plan/${
      plan_id ? plan_id : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const update_portals_for_plan_api = async (plan_id, data) => {
  const requestObj = {
    path: `/api/payment_plan/update_portals_for_plan/${plan_id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
