import { invokeApi } from "../../bl_libs/invokeApi";
export const AddEmailSettingApi = async (data) => {
  const requestObj = {
    path: `/api/email_setting/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateThanksSettingApi = async (data, slug) => {
  const requestObj = {
    path: `/api/sale_page/update/page-content/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateUnpublishSetting = async (data) => {
  const requestObj = {
    path: `/api/sale_page/update_page_access_info`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const emailSettingApi = async (data) => {
  const requestObj = {
    path: `/api/email_setting/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const updateSiteSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/update_pages_content`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const clientSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const updateConsultantGeneralSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/add_consultant_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateClientGeneralSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/client_general_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateClientContentSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateClientDashboardSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/dashboard_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
