import { invokeApi } from "../../bl_libs/invokeApi";

export const editProfileApi = async (data) => {
  const requestObj = {
    path: `/admin_users/update_admin_user`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
