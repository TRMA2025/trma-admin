import axios from "axios";
import { invokeApi } from "../../bl_libs/invokeApi";
import { baseUri } from "../../config/config";

export const programmeListing = async (data) => {
  const requestObj = {
    path: `/api/program/`,
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
export const childProgrammeListing = async (id, child_id) => {
  const requestObj = {
    path: `/api/program/list_parent_progam/${id}/${child_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addChildProgrammeListing = async (id) => {
  const requestObj = {
    path: `/api/program/parent_program_list/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const childEventListing = async (id, child_id) => {
  const requestObj = {
    path: `/api/event/get_parent_event/${id}/${child_id}`,
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
export const programmeDetail = async (data) => {
  const requestObj = {
    path: `/api/program/get_program/${data}`,
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
// Authenticated PDF download (13 Sep 2026). Resource PDFs are private in
// storage, so they cannot be linked directly - the bytes are fetched with the
// auth header and handed to the browser as a blob.
export const downloadProgrammeDocumentPdf = async (slug, filename) => {
  const response = await axios({
    method: "GET",
    url: `${baseUri}/api/program_document/download/${slug}`,
    headers: { "x-sh-auth": localStorage.getItem("token") },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "resource.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Detaches the file from the record. The stored file itself is retained.
export const removeProgrammeDocumentFileApi = async (slug) => {
  const requestObj = {
    path: `/api/program_document/remove_file/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
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

// Lesson section=================================================
export const LessonSectionList = async (data) => {
  const requestObj = {
    path: `/api/lesson_sction/get/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddLessonSectionApi = async (data) => {
  const requestObj = {
    path: `/api/lesson_sction/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editLessonSectionApi = async (data, slug) => {
  const requestObj = {
    path: `/api/lesson_sction/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const deleteLessonSectionApi = async (id) => {
  console.log(localStorage.getItem("token"), "tokekskahlshdjashj");
  console.log(id, "ididid");
  const requestObj = {
    path: `/api/lesson_sction/delete/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
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

export const bulkMemberListing = async (page, limit, search) => {
  const requestObj = {
    path: `/api/program/list_members_for_program/selection?page=${page}&limit=${limit}&search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const programmeMemberListing = async (id, page, limit, search) => {
  const requestObj = {
    path: `/api/program/list_program_members/${id}?page=${page}&limit=${limit}&search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const add_programme_bulk_access_api = async (data) => {
  const requestObj = {
    path: `/api/member/remove_program_bulk/access`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const programme_detail_api = async (data) => {
  const requestObj = {
    path: `/api/program/get_program/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
