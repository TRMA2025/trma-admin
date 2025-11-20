import { invokeApi } from "../../bl_libs/invokeApi";

export const teamNotification = async (data) => {
  const requestObj = {
    path: `api/notify/notify_listing_for_team.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const teamNotificationStatusChange = async (data) => {
  const requestObj = {
    path: `api/notify/change_notify_status.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const teamNotificationAllRead = async (data) => {
  const requestObj = {
    path: `api/notify/mark_all_as_read.php`,
    method: "POST",
    headers: {
      // 'x-sh-auth': localStorage.getItem('token')
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const notification_list_with_pagination = async (api_path) => {
  const requestObj = {
    path: `/${api_path}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const read_all_notification = async () => {
  const requestObj = {
    path: `/api/notification/read_all_notifications`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const read_notification_by_id = async (id) => {
  const requestObj = {
    path: `/api/notification/read_notification/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
