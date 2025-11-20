import { invokeApi } from "../../bl_libs/invokeApi";

export const questionReplyHistory = async (data) => {
  const requestObj = {
    path: `/api/member/get_answer_stat`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateSubscriberApi = async (id, data) => {
  const requestObj = {
    path: `/api/event_subscriber/edit_subscriber/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addPersonalNote = async (data) => {
  const requestObj = {
    path: `/api/member/update_personal_note`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const memberDetailBeforeEditApi = async (id) => {
  const requestObj = {
    path: `/api/member/member_detail_before_edit/${id ? id : ""}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const affiliateSearchInEditMember = async (search) => {
  const requestObj = {
    path: `/app/affiliate_search?search_text=${search ? search : " "}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const activeMemberListing = async (data) => {
  const requestObj = {
    path: `/api/member/active_member_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberDetailApi = async (id) => {
  const requestObj = {
    path: `/api/member/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const wheelOfLifeMemberDetail = async (id) => {
  const requestObj = {
    path: `/api/member/member_wheel_of_life_detail/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const memberListing = async (page, limit, data) => {
  const requestObj = {
    path: `/api/member/member_list_v2?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const memberSubscriberListingApi = async (id, page, limit, search) => {
  const requestObj = {
    path: `/api/member/event_subscriber_list/member_id/${id}?page=${page}&limit=${limit}&search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const memberPodsListing = async (id) => {
  const requestObj = {
    path: `/api/member/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const getSubscriberDetailApi = async (id) => {
  const requestObj = {
    path: `/api/event_subscriber/subscriber/detail/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberCompleteListing = async (id) => {
  const requestObj = {
    path: `/api/member`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberAndGroupsListApi = async (search) => {
  const requestObj = {
    path: `/api/member/members_and_groups/list?search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const memberInCalendarGroupsListApi = async (search) => {
  const requestObj = {
    path: `/api/member/members_for_select/list?search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberAndGroupsEventInCalendarGroupsListApi = async (search) => {
  const requestObj = {
    path: `/api/member/members_and_programs/list?search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberGoalStatementListApi = async (id) => {
  const requestObj = {
    path: `/api/member/get_goal_statement_by_member_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberTransactionListApi = async (id) => {
  const requestObj = {
    path: `/api/member/all_transaction_by_member_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberEventSubscriberListing = async (id) => {
  // console.log(search, "search");
  const requestObj = {
    path: `/api/member/member_event_subscriber_list/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberBillingListApi = async (id) => {
  const requestObj = {
    path: `/api/payment_request/payment_request_list_by_member/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const paymentTemplateListApi = async (id) => {
  const requestObj = {
    path: `/api/payment_template`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const productListApi = async (id) => {
  const requestObj = {
    path: `/api/product`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberBillingDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/payment_request/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberGroupListApi = async (id) => {
  const requestObj = {
    path: `/api/member/member_group_list/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_member_from_proggram_event_Api = async (data) => {
  const requestObj = {
    path: `/api/member/assign_program_members_to_events`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddMemberApi = async (data) => {
  const requestObj = {
    path: `/api/member`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addPaymentRequest = async (data) => {
  const requestObj = {
    path: `/api/payment_request`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddKReplyApi = async (data) => {
  const requestObj = {
    path: `/api/goal_statement_reply/add_reply`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const importMemberApi = async (data) => {
  const requestObj = {
    path: `/api/member/add_member_from_csv`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const add_member_from_csv_for_event = async (data) => {
  const requestObj = {
    path: `/api/member/add_member_from_csv_for_event`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const programmeAccessApi = async (id, data) => {
  const requestObj = {
    path: `/api/member/add_program_against_member/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const rewardAccessApi = async (id, data) => {
  const requestObj = {
    path: `/api/member/add_reward_against_member/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditMemberApi = async (data, id) => {
  const requestObj = {
    path: `/api/member/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteMemberApi = async (id) => {
  const requestObj = {
    path: `/api/member/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const reset_assement_api = async (member_id) => {
  const requestObj = {
    path: `/api/member/reset_attitude_assessment_history/${member_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const afflicateChangeid = async (postData, id) => {
  const requestObj = {
    path: `/app/affiliate_url_name/update/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: postData,
  };
  return invokeApi(requestObj);
};

export const DeleteSubscriberMemberApi = async (id) => {
  const requestObj = {
    path: `/api/event_subscriber/delete_event_subscriber/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteMultiMemberApi = async (data) => {
  // console.log(...data, "new arraysapi side");
  const requestObj = {
    path: `/api/member/delete_all_and_specific_member`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteQuestionCommentApi = async (id) => {
  const requestObj = {
    path: `/api/goal_statement_question/comment/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeletePaymentRequestApi = async (slug) => {
  const requestObj = {
    path: `/api/payment_request/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteCommentApi = async (slug) => {
  const requestObj = {
    path: `/api/goal_statement_reply/delete_reply/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const changeMemberPassword = async (data, id) => {
  const requestObj = {
    path: `/api/member/change_password/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

// ---------------------------------------------------------------
export const memberHistoryApi = async (data, page, limit) => {
  const requestObj = {
    path: `/api/feeds/member_feed_with_pagination?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const member_login_api = async (data) => {
  const requestObj = {
    path: `/app/token_generate_from_impersonate`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const member_diary_api = async (id, page, limit) => {
  const requestObj = {
    path: `/api/dynamite_diary/list_member_diaries_for_admin/${id}?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
