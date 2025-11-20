import { invokeApi } from "../../bl_libs/invokeApi";

export const dashboardApi = async (data) => {
  const requestObj = {
    path: `/admin_users/dashboard`,

    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const login = async (data) => {
  const requestObj = {
    path: `/admin_users/`,
    method: "POST",
    headers: {
      // 'x-sh-auth': 1234
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const changePasswordApi = async (data) => {
  const requestObj = {
    path: `/admin_users/admin_change_password`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const logout = async (data) => {
  const requestObj = {
    path: `api/logout.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': 1234
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const register = async (data) => {
  const requestObj = {
    path: `api/user_registor.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const confirmEmail = async (data) => {
  const requestObj = {
    path: `/admin_users/email_confirmation`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const confirmPinCode = async (data) => {
  const requestObj = {
    path: `/admin_users/email_code_verification`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const updatePassword = async (data) => {
  const requestObj = {
    path: `api/change_password/update_password.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const profileDetail = async (data) => {
  const requestObj = {
    path: `api/user_profile/detail_profile.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const updateAdminPassword = async (data) => {
  const requestObj = {
    path: `api/update_password/update_password.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const updateProfile = async (data) => {
  const requestObj = {
    path: `api/user_profile/edit_profile.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
