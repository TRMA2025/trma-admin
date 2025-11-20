import { invokeApi } from "../../bl_libs/invokeApi";

export const uploadImageOns3 = async (data) => {
  const requestObj = {
    path: `/app/update_image_on_s3`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const uploadFeedImageOns3 = async (data) => {
  const requestObj = {
    path: `/app/upload_image_on_s3`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const uploadSupportImageOns3 = async (data) => {
  const requestObj = {
    path: `/api/support_ticket/upload_support_ticket_comment_images`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
