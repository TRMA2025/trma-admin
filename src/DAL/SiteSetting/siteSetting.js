import { invokeApi } from "../../bl_libs/invokeApi";
export const addStripeApi = async (data) => {
  const requestObj = {
    path: `/api/site_setting/add_stripe_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addCampaignApi = async (data) => {
  const requestObj = {
    path: `/api/site_setting/add_active_compaign_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addSandGrid = async (data) => {
  const requestObj = {
    path: `/api/site_setting/add_sendgrid_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const siteSettingApi = async (data) => {
  const requestObj = {
    path: `/api/site_setting`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const defaultSettingApi = async (data) => {
  const requestObj = {
    path: `/api/default_setting/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const ProjectInfoApi = async () => {
  const requestObj = {
    path: `/api/admin_init`,
    method: "GET",
    headers: {
      // "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addDefaultSettingApi = async (data) => {
  const requestObj = {
    path: `/api/default_setting/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };

  return invokeApi(requestObj);
};
export const addInvoiceSettingApi = async (data) => {
  const requestObj = {
    path: `/api/content_setting/invoice_setting`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };

  return invokeApi(requestObj);
};
export const emailTemplateApi = async (data) => {
  const requestObj = {
    path: `/api/email_template/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };

  return invokeApi(requestObj);
};
export const editEmailTemplateApi = async (data, id) => {
  const requestObj = {
    path: `/api/email_template/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };

  return invokeApi(requestObj);
};
export const detailEmailTemplateApi = async (id) => {
  const requestObj = {
    path: `/api/email_template/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };

  return invokeApi(requestObj);
};
