import { invokeApi } from "../../bl_libs/invokeApi";

export const client_helping_videos = async (data) => {
  const requestObj = {
    path: `api/helping_videos/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const dynamite_events_list_api = async (search) => {
  const requestObj = {
    path: `/api/dynamite_event?search_text=${search ? search : ""}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberProgrammeListing = async (id) => {
  const requestObj = {
    path: `/api/member/get_client_programs?member_id=${id ? id : ""}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const memberProgrammeListings = async (id) => {
  const requestObj = {
    path: `/api/program/active_program_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const rewardListing = async (data) => {
  const requestObj = {
    path: `/api/rewards/priority`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const programmeActiveListing = async (data) => {
  const requestObj = {
    path: `/api/program/active_program_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const programmeActiveListings = async (data) => {
  const requestObj = {
    path: `api/program/active_program_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const client_videos_detail = async (data) => {
  const requestObj = {
    path: `/api/helping_videos/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const programmeDetailApi = async (data) => {
  const requestObj = {
    path: `/api/program/get_program/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const deleteAudioApi = async (data, slug) => {
  const requestObj = {
    path: `/api/program/${slug}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddProgrammeApi = async (data) => {
  const requestObj = {
    path: `/api/program`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditProgrammeApi = async (data, slug) => {
  const requestObj = {
    path: `/api/program/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteProgramme = async (slug) => {
  const requestObj = {
    path: `/api/program/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// programme document
export const programmeDocumentListingApi = async (data) => {
  const requestObj = {
    path: `/api/program_document/document_list_by_program/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddProgrammeDocumentApi = async (data) => {
  const requestObj = {
    path: `/api/program_document`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditProgrammeDocumentApi = async (data, slug) => {
  const requestObj = {
    path: `/api/program_document/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
// deleteProgrammeDocumentApi
export const deleteProgrammeDocumentApi = async (slug) => {
  const requestObj = {
    path: `/api/program_document/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// Reviews api
export const programmeReviewApi = async (data) => {
  const requestObj = {
    path: `/api/program_review/review_list_by_program/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const AddProgrammeReviewApi = async (data) => {
  const requestObj = {
    path: `/api/program_review/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditProgrammeReviewApi = async (data, slug) => {
  const requestObj = {
    path: `/api/program_review/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const deleteProgrammeReviewApi = async (slug) => {
  const requestObj = {
    path: `/api/program_review/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// locked programme info

export const lockedProgramInfo = async (data, slug) => {
  const requestObj = {
    path: `/api/program/update_locked_program_info/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

// program section=================================================

export const programmeSectionList = async (data) => {
  const requestObj = {
    path: `/api/program_section/section_list_by_program/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddProgrammeSectionApi = async (data) => {
  const requestObj = {
    path: `/api/program_section/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditProgrammeSectionApi = async (data, slug) => {
  const requestObj = {
    path: `/api/program_section/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteProgrammeSectionApi = async (slug) => {
  const requestObj = {
    path: `/api/program_section/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// Automated Group==============================================

export const programmeAutoGroupList = async (data) => {
  const requestObj = {
    path: `/api/group/automated_group_list/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddProgrammeAutoGroupApi = async (data) => {
  const requestObj = {
    path: `/api/group/add_automated_group/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditProgrammeAutoGroupApi = async (data, slug) => {
  const requestObj = {
    path: `/api/group/update_automated_group/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteProgrammeAutoGroupApi = async (slug) => {
  const requestObj = {
    path: `/api/group/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
