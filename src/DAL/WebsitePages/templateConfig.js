import { invokeApi } from "../../bl_libs/invokeApi";

export const getTemplateConfigListApi = async (id) => {
  const requestObj = {
    path: `/api/template_configuration/active_template_configuration`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const templateAccessListApi = async (id, data) => {
  const requestObj = {
    path: `/api/consultant/manage_template_configration_access_for_consultant/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const manage_module_acceess_api = async (page_slug, data) => {
  const requestObj = {
    path: `/api/template_configuration/manage_module/${page_slug}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_template_config_by_consultant = async (id) => {
  const requestObj = {
    path: `/api/consultant/template_list_for_consultant/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const get_template_detail_api = async (id) => {
  const requestObj = {
    path: `/api/template_configuration/get_template/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
