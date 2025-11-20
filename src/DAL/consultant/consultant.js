import { invokeApi } from "../../bl_libs/invokeApi";

export const consultantListing = async (data) => {
  const requestObj = {
    path: `/api/consultant`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantEventListing = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_events/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const event_listing_by_consultant = async (start_date, end_date, id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_events/${id}?start_date=${start_date}&end_date=${end_date}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantGroupListingApi = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_groups/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantPodApi = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_rooms/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantPodsDetailApi = async (id) => {
  const requestObj = {
    path: `/api/room/detail/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantRecordingListing = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_programme_recording/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantGroupDetail = async (slug) => {
  const requestObj = {
    path: `/api/group/detail/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantGroupAllMember = async (
  slug,
  search,
  page,
  rowsPerPage
) => {
  const requestObj = {
    path: `/api/group/all_group_members/${slug}?search=${search}&page=${page}&limit=${rowsPerPage}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantMembersList = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_members/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantGoalStatementListApi = async (id) => {
  const requestObj = {
    path: `/api/consultant/get_consultant_goal_statement/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const consultantGoalStatementDetailApi = async (id) => {
  const requestObj = {
    path: `/api/goal_statement_question/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddConsultantApi = async (data) => {
  const requestObj = {
    path: `/api/consultant`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const consultantChangePasswordApi = async (data) => {
  const requestObj = {
    path: `/api/consultant/consultant_change_password`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditConsultantApi = async (data, id) => {
  const requestObj = {
    path: `/api/consultant/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteConsultantApi = async (id) => {
  const requestObj = {
    path: `/api/consultant/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const Deleteticket = async (id) => {
  const requestObj = {
    path: `/api/support_ticket/delete_support_ticket/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const MoveTrash = async (id) => {
  const requestObj = {
    path: `/api/support_ticket/trash_support_ticket/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteGoalStatementQuestionApi = async (id) => {
  const requestObj = {
    path: `/api/goal_statement_question/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteConsultantGroupApi = async (slug) => {
  const requestObj = {
    path: `/api/group/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteConsultantRecordingApi = async (id) => {
  const requestObj = {
    path: `/api/program_recording/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteRoomUserApi = async (slug, id) => {
  const requestObj = {
    path: `/api/room/${slug}/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
