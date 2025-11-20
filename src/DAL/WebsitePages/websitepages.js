import { invokeApi } from "../../bl_libs/invokeApi";
export const pagesListingApi = async (page, rowsPerPage, searchText, type) => {
  const requestObj = {
    path: `/api/sale_page?page=${page}&limit=${rowsPerPage}&search_text=${searchText}&type=${type}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const pageSubscriberListingApi = async (id, page, limit) => {
  const requestObj = {
    path: `/api/event_subscriber/subscriber_list_with_page_id/${id}?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const pageSubscriberListingApiNew = async (id, page, limit, search) => {
  const requestObj = {
    path: `/api/event_subscriber/subscriber_list_with_page_id_v1/${id}?page=${page}&limit=${limit}&search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const socailSharingUpdateApi = async (data, id) => {
  const requestObj = {
    path: `/api/sale_page/update_page/social_sharing/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeletePageSubscriberMemberApi = async (id) => {
  const requestObj = {
    path: `/api/event_subscriber/delete_event_subscriber/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const templateListingApi = async (data) => {
  const requestObj = {
    path: `/api/template_configuration/active_template_configuration`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_page_list_for_consultant_api = async (id) => {
  const requestObj = {
    path: `/api/sale_page/get_page_list_for_consultant/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const list_thanks_and_payement_page_for_selection_api = async () => {
  const requestObj = {
    path: `/api/sale_page/list_thanks_and_payement_page/selection`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const manage_template_access_for_consultant_api = async (id, data) => {
  const requestObj = {
    path: `/api/consultant/manage_template_access_for_consultant/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const manage_commission_access_for_consultant_api = async (data) => {
  const requestObj = {
    path: `/api/consultant/access_sales_commission`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const import_template_data_api = async (id) => {
  const requestObj = {
    path: `/app/import_template_data`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: id,
  };
  return invokeApi(requestObj);
};

export const addWebsiteEvent = async (data) => {
  const requestObj = {
    path: `/api/home_event/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editWebsiteEvent = async (data, id) => {
  const requestObj = {
    path: `/api/home_event/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteWebsiteEvent = async (id) => {
  const requestObj = {
    path: `/api/home_event/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteSalePageApi = async (slug) => {
  const requestObj = {
    path: `/api/sale_page/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const WebsiteEventDetail = async (id) => {
  const requestObj = {
    path: `/api/home_event/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const addPageApi = async (data) => {
  const requestObj = {
    path: `/api/sale_page`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editPageApi = async (data, id) => {
  const requestObj = {
    path: `/api/sale_page/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const detailPageApi = async (id) => {
  const requestObj = {
    path: `/api/sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const page_detail_by_id = async (id) => {
  const requestObj = {
    path: `/api/sale_page/sale_page_detail_by_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const detailContentPageApi = async (id) => {
  const requestObj = {
    path: `/api/sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const updatePageContentSettingApi = async (data, id) => {
  const requestObj = {
    path: `/api/sale_page/update_sale_page_detail/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const websiteEventListApi = async (api_path) => {
  // let api_path = id;
  // if (id) {
  //   api_path = `/api/home_event/home_event_by_sale_page/${id}`;
  // }
  const requestObj = {
    path: api_path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};

export const addPageEventApi = async (data) => {
  const requestObj = {
    path: `/api/home_event/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editPageEventApi = async (data, id) => {
  const requestObj = {
    path: `/api/home_event/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const changePageAccessApi = async (data) => {
  const requestObj = {
    path: `/api/sale_page/control_page_access`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const changeDelegateCommissionApi = async (data) => {
  const requestObj = {
    path: `/api/consultant/access_sales_commission_by_page_id`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const sale_page_list_with_plans_api = async () => {
  const requestObj = {
    path: `/api/sale_page/list/with_plans`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const subscription_list_with_page_and_plan = async (
  page,
  limit,
  data
) => {
  const requestObj = {
    path: `/admin_users/subscription/list?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
